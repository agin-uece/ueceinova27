# syntax=docker/dockerfile:1

# ---------- base: JDK + Gradle (usado por dev) ----------
FROM gradle:8.14.3-jdk21 AS dev
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["./gradlew", "bootRun"]

# ---------- build: gera o jar de producao ----------
FROM dev AS build
RUN ./gradlew bootJar -x test --no-daemon \
 && cp "$(ls build/libs/*.jar | grep -v -- '-plain.jar' | head -n 1)" /app/app.jar

# ---------- prod: apenas JRE + jar ----------
FROM eclipse-temurin:21-jre AS prod
WORKDIR /app
RUN useradd --system --no-create-home appuser
COPY --from=build /app/app.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
