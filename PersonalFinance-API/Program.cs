using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PersonalFinance.Application.Authentication;
using PersonalFinance.Application.Category.Commands;
using PersonalFinance.Application.Category.Queries;
using PersonalFinance.Application.Category.Validations;
using PersonalFinance.Application.Transaction.Commands;
using PersonalFinance.Application.Transaction.Queries;
using PersonalFinance.Application.Transaction.Validations;
using PersonalFinance.Domain.Constants;
using PersonalFinance.Domain.Entities;
using PersonalFinance.Infrastructure.DbContext;
using PersonalFinance.Infrastructure.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
Env.Load();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DB context
var connectionString = Env.GetString("DB_CONNECTION_STRING")
    ?? throw new InvalidOperationException("Connection string not found");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// Register DI services
builder.Services.AddScoped<ICategoryQueries, CategoryQueries>();
builder.Services.AddScoped<ICategoryCommands, CategoryCommands>();
builder.Services.AddScoped<ITransactionQueries, TransactionQueries>();
builder.Services.AddScoped<ITransactionCommands, TransactionCommands>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
// Validations
builder.Services.AddScoped<CategoryValidations>();
builder.Services.AddScoped<TransactionValidations>();
// Identity
builder.Services.AddScoped<IAuthTokenProvider, JwtProvider>();
builder.Services.AddIdentity<M_AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
// Configure Identity options
builder.Services.Configure<IdentityOptions>(options =>
{
    //Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    options.User.RequireUniqueEmail = true;
});

// Add authentication
var jwtIssuer = builder.Configuration["Technical:JwtSettings:Issuer"];
var jwtAudience = builder.Configuration["Technical:JwtSettings:Audience"];
builder.Services.AddAuthentication()
// Define scheme for mobile authentication
.AddJwtBearer(AuthenticationConstants.MobileAuthScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable(AuthenticationConstants.JwtSecretEnv) ?? ""))
    };
})
// Define scheme for web authentication
.AddJwtBearer(AuthenticationConstants.WebAuthScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable(AuthenticationConstants.JwtSecretEnv) ?? ""))
    };

    //Get jwt from cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            ctx.Request.Cookies.TryGetValue(AuthenticationConstants.JwtCookieKey, out var accessToken);
            if (!string.IsNullOrEmpty(accessToken))
                ctx.Token = accessToken;
            return Task.CompletedTask;
        }
    };
})
.AddCookie("External");
//.AddGoogle(options =>
//{
//    options.ClientId = Environment.GetEnvironmentVariable(AuthenticationConstants.GoogleClientId) ?? "";
//    options.ClientSecret = Environment.GetEnvironmentVariable(AuthenticationConstants.GoogleClientSecret) ?? "";
//    options.SignInScheme = "External";
//    options.Scope.Add("email");
//    options.Scope.Add("profile");
//    options.SaveTokens = true;
//});

// Define different policies for authorization
builder.Services.AddAuthorization(options =>
{
    // Use all schemes when applying [Authorization]
    options.DefaultPolicy = new AuthorizationPolicyBuilder(
        AuthenticationConstants.MobileAuthScheme,
        AuthenticationConstants.WebAuthScheme)
        .RequireAuthenticatedUser()
        .Build();

    // Policy for mobile authentication
    options.AddPolicy(
        AuthenticationConstants.MobileAuthScheme,
        new AuthorizationPolicyBuilder(
            AuthenticationConstants.WebAuthScheme)
        .RequireAuthenticatedUser()
        .Build());

    // Policy for web authentication
    options.AddPolicy(
        AuthenticationConstants.WebAuthScheme,
        new AuthorizationPolicyBuilder(
            AuthenticationConstants.WebAuthScheme)
        .RequireAuthenticatedUser()
        .Build());
});

// Configure cookie policy options
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.None;
    options.Secure = CookieSecurePolicy.Always;
});

// Configure CORS policy to allow requests from the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy(AuthenticationConstants.CommonCorsPolicy, policy =>
    {
        policy.WithOrigins(
                "https://localhost:5173"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // this allows cookies
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AuthenticationConstants.CommonCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
