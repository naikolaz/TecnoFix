# ==========================================
# 1. Build Stage (.NET 10 SDK)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar paquetes NuGet
COPY ["TecnoFixBack.csproj", "./"]
RUN dotnet restore "TecnoFixBack.csproj"

# Copiar el resto del código fuente y compilar en modo Release
COPY . .
RUN dotnet publish "TecnoFixBack.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# 2. Runtime Stage (.NET 10 ASP.NET Core)
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copiar los binarios publicados desde la etapa de compilación
COPY --from=build /app/publish .

# Render asigna dinámicamente el puerto mediante la variable PORT (por defecto 10000)
ENV ASPNETCORE_HTTP_PORTS=10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Iniciar la aplicación
ENTRYPOINT ["dotnet", "TecnoFixBack.dll"]
