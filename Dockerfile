# ==========================================
# 1. Build Stage (.NET 10 SDK)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar csproj del backend y restaurar dependencias
COPY ["TecnoFixBack/TecnoFixBack.csproj", "TecnoFixBack/"]
RUN dotnet restore "TecnoFixBack/TecnoFixBack.csproj"

# Copiar código del backend y compilar en modo Release
COPY TecnoFixBack/ TecnoFixBack/
WORKDIR "/src/TecnoFixBack"
RUN dotnet publish "TecnoFixBack.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# 2. Runtime Stage (.NET 10 ASP.NET Core)
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copiar los binarios publicados
COPY --from=build /app/publish .

# Render asigna dinámicamente el puerto mediante la variable PORT (por defecto 10000)
ENV ASPNETCORE_HTTP_PORTS=10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Iniciar la aplicación
ENTRYPOINT ["dotnet", "TecnoFixBack.dll"]
