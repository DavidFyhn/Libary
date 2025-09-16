FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

COPY api/api.csproj ./api/
COPY DataAccess/DataAccess.csproj ./DataAccess/

RUN dotnet restore api/api.csproj

COPY api/. ./api/
COPY DataAccess/. ./DataAccess/

WORKDIR /source/api
RUN dotnet publish -c release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./

EXPOSE 8080

ENTRYPOINT ["dotnet", "api.dll"]
