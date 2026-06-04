# 🏆 Buenas Prácticas de Programación y Arquitectura

Este documento recopila las mejores prácticas de desarrollo de software, patrones de diseño y principios de clean code aplicados en el proyecto **node-noc**. Sirve como guía de referencia técnica para asegurar que el código continúe siendo legible, escalable, robusto y testeable.

---

## 📂 Índice de Buenas Prácticas

1. [Patrón Objeto de Opciones (Options Object Pattern)](#1-patrón-objeto-de-opciones-options-object-pattern)
2. [Validación de Configuración en Tiempo de Carga (Fail-Fast Configuration)](#2-validación-de-configuración-en-tiempo-de-carga-fail-fast-configuration)
3. [Clases Abstractas como Interfaces / Contratos](#3-clases-abstractas-como-interfaces--contratos)
4. [Principio de Inversión de Dependencias (SOLID - DIP)](#4-principio-de-inversión-de-dependencias-solid---dip)
5. [Encapsulación y Métodos de Factoría Estáticos (Static Factory Methods)](#5-encapsulación-y-métodos-de-factoría-estáticos-static-factory-methods)
6. [Tipado Estricto mediante Enums](#6-tipado-estricto-mediante-enums)
7. [Principio de Responsabilidad Única (SOLID - SRP)](#7-principio-de-responsabilidad-única-solid---srp)

---

### 1. Patrón Objeto de Opciones (Options Object Pattern)

#### 🔍 Práctica Aplicada
En lugar de pasar múltiples parámetros posicionales a constructores o funciones (lo cual es propenso a errores y dependiente de un orden específico), agrupamos los parámetros en una interfaz de opciones tipada.

*   **Ejemplo en Entidades (`src/domain/entities/log.entity.ts`):**
    ```typescript
    export interface LogEntityOptions {
      level: LogSeverityLevel;
      message: string;
      origin: string;
      createdAt?: Date;
    }

    export class LogEntity {
      constructor(options: LogEntityOptions) {
         // ...
      }
    }
    ```
*   **Ejemplo en Servicios (`src/presentation/email/email.service.ts`):**
    ```typescript
    interface SendEmailOptions {
      to: string | string[];
      subject: string;
      htmlBody: string;
      attachments?: Attachment[];
    }
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Legibilidad mejorada:** Al instanciar o invocar el método, el desarrollador debe nombrar explícitamente cada campo (ej. `message: "...", level: ...`), facilitando la lectura del código.
*   **Facilidad de refactorización:** Permite añadir parámetros adicionales u opcionales en el futuro sin romper las llamadas ya existentes en otras partes del código.
*   **Previene errores:** Elimina la posibilidad de confundir el orden de dos parámetros del mismo tipo (como pasar accidentalmente el `origin` en el lugar del `message`).

---

### 2. Validación de Configuración en Tiempo de Carga (Fail-Fast Configuration)

#### 🔍 Práctica Aplicada
Utilizamos un plugin de configuración centralizado (`envs.plugin.ts`) ayudado por la librería `env-var` para validar y tipar de forma estricta las variables de entorno (`.env`) al iniciar la aplicación.

*   **Ejemplo (`src/config/plugins/envs.plugin.ts`):**
    ```typescript
    import "dotenv/config";
    import * as env from "env-var";

    export const envs = {
      PORT: env.get("PORT").required().asPortNumber(),
      MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
      MAILER_EMAIL: env.get("MAILER_EMAIL").required().asEmailString(),
      MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").required().asString(),
      PROD: env.get("PROD").default("false").asBool(),
    };
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Enfoque Fail-Fast (Fallo Inmediato):** Si falta alguna variable requerida o tiene un formato incorrecto (ej. un puerto que no es número o un correo mal estructurado), la aplicación lanzará un error y se detendrá inmediatamente en el arranque en lugar de fallar silenciosa o misteriosamente en producción cuando intente enviar un correo.
*   **Tipado estricto:** Convierte los strings crudos de `process.env` en tipos reales de TypeScript (`number`, `boolean`, `string`), previniendo errores de coerción de tipos.

---

### 3. Clases Abstractas como Interfaces / Contratos

#### 🔍 Práctica Aplicada
Definimos los contratos del sistema (las firmas de métodos de orígenes de datos y repositorios) utilizando clases abstractas con métodos `abstract` en lugar de interfaces nativas de TypeScript.

*   **Ejemplo (`src/domain/repository/log.respository.ts`):**
    ```typescript
    export abstract class LogRepository {
      abstract saveLog(log: LogEntity): Promise<void>;
      abstract getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
    }
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Preservación en tiempo de ejecución:** Las interfaces en TypeScript son puramente decorativas en desarrollo y desaparecen por completo tras la compilación a JavaScript. Las clases abstractas, en cambio, sí generan código JS.
*   **Soporte de Reflexión e Inyección:** Esto permite usarlas como tokens para sistemas de inyección de dependencias (DI) o validarlas en tiempo de ejecución usando `instanceof`.

---

### 4. Principio de Inversión de Dependencias (SOLID - DIP)

#### 🔍 Práctica Aplicada
La regla de negocio (los Casos de Uso) no depende de implementaciones técnicas concretas. Depende exclusivamente de abstracciones (interfaces o clases abstractas) inyectadas a través del constructor.

*   **Ejemplo (`src/domain/use-cases/checks/check-service.ts`):**
    ```typescript
    export class CheckService implements CheckServiceUseCase {
      constructor(
        private readonly logRepository: LogRepository, // Dependencia de la abstracción
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback,
      ) {}
    }
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Bajo Acoplamiento:** El caso de uso no sabe (ni le importa) si los logs se guardan en archivos locales, una base de datos PostgreSQL, MongoDB o si se envían por una API. Solo sabe que hay un contrato `LogRepository` con un método `saveLog`.
*   **Mantenimiento simplificado:** Cambiar la base de datos se reduce a crear un nuevo datasource que cumpla el contrato e inyectarlo en el servidor; el caso de uso permanece intacto.
*   **Pruebas unitarias de calidad:** Permite inyectar repositorios "mockeados" (falsos) fácilmente para probar las decisiones lógicas del servicio de manera veloz y aislada sin tocar archivos o redes reales.

---

### 5. Encapsulación y Métodos de Factoría Estáticos (Static Factory Methods)

#### 🔍 Práctica Aplicada
Centralizamos la lógica de parseo y deserialización de datos estructurados directamente dentro de la entidad correspondiente mediante métodos de factoría estáticos.

*   **Ejemplo (`src/domain/entities/log.entity.ts`):**
    ```typescript
    export class LogEntity {
      // ...
      static fromJson(json: string): LogEntity {
        const { message, level, createdAt, origin } = JSON.parse(json);
        const log = new LogEntity({
          message,
          level,
          createdAt: new Date(createdAt),
          origin,
        });
        return log;
      }
    }
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Encapsulación de lógica de mapeo:** Evita que múltiples datasources tengan que repetir el código de parsear el JSON y mapearlo a la clase. Si el formato interno del JSON cambia en el futuro, solo modificaremos esta función estática en la Entidad.
*   **Control de creación de objetos:** Nos asegura que cualquier instancia de `LogEntity` generada a partir de un JSON externo cumpla de manera estricta con las propiedades esperadas de nuestro modelo de negocio.

---

### 6. Tipado Estricto mediante Enums

#### 🔍 Práctica Aplicada
Utilizamos enumeraciones (`enums`) para definir un conjunto cerrado y seguro de valores posibles para características cruciales del sistema, como los niveles de severidad de un log.

*   **Ejemplo (`src/domain/entities/log.entity.ts`):**
    ```typescript
    export enum LogSeverityLevel {
      LOW = "low",
      MEDIUM = "medium",
      HIGH = "high",
    }
    ```

#### 💡 ¿Por qué es una Buena Práctica?
*   **Eliminación de "Magic Strings":** Evita usar cadenas de texto plano como `"low"`, `"medium"` o `"high"` dispersas por todo el código, que son altamente propensas a errores ortográficos accidentales (ej. `"higt"` en vez de `"high"`).
*   **Facilidad en el desarrollo:** Ofrece autocompletado nativo en el editor de código e impide compilar el proyecto si se pasa un nivel de severidad inexistente.

---

### 7. Principio de Responsabilidad Única (SOLID - SRP)

#### 🔍 Práctica Aplicada
Cada clase, módulo y función tiene una única e inequívoca responsabilidad dentro de su respectiva capa arquitectónica.

*   **`CronService`:** Se limita exclusivamente a interactuar con la biblioteca `cron` para iniciar tareas calendarizadas de forma desacoplada. No sabe qué lógica de negocio ejecuta.
*   **`EmailService`:** Se limita únicamente a la conexión SMTP y el envío físico de correos con nodemailer.
*   **`FileSystemDataSource`:** Su único propósito es leer y escribir bytes en archivos de texto en el disco local.
*   **`CheckService`:** Su única responsabilidad es ejecutar la lógica de negocio de verificar el estado de una URL y gatillar la persistencia de su resultado.

#### 💡 ¿Por qué es una Buena Práctica?
*   **Fácil de depurar y comprender:** Si se produce un error al enviar correos electrónicos, los desarrolladores saben con certeza que el problema reside en `EmailService`, minimizando el tiempo de diagnóstico.
*   **Aumento de la reusabilidad:** Los servicios se vuelven bloques autónomos que pueden reutilizarse en múltiples partes de la aplicación de manera limpia.

---