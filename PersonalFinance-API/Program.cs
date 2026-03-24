using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.Application.Category.Commands;
using PersonalFinance.Application.Category.Queries;
using PersonalFinance.Application.Category.Validations;
using PersonalFinance.Application.Transaction.Commands;
using PersonalFinance.Application.Transaction.Queries;
using PersonalFinance.Infrastructure.DbContext;

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

builder.Services.AddScoped<CategoryValidations>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
