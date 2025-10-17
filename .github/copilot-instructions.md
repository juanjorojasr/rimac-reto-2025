# Proyecto: Buscador de Talleres RIMAC

## Consideraciones para respuestas de agente
No generar archivos de documentación o resúmenes o cambios (.md, .txt, etc) si no se le ha solicitado

## Resumen del Proyecto
Sistema web de autoservicio que permite a clientes de seguros vehiculares
buscar talleres disponibles sin necesidad de llamar por teléfono.

**Contexto de Uso**: Portal web para clientes autenticados con pólizas activas.

---

## Autenticación (Simulada para MVP)

### Sesión del Cliente Autenticado
Se simula un cliente ya logueado mediante un archivo de constantes:

```typescript
// src/constants/session.constants.ts
export const CLIENTE_AUTENTICADO = {
  dni: '99999999',
  nombre: 'Cliente Demo'
};
```

Este cliente tiene acceso a las pólizas definidas en los datos de prueba.

---

## Modelo de Negocio

### Estructura Jerárquica

```
Cliente
  └── Póliza (puede tener múltiples pólizas activas)
      ├── Clausulas VEHA (determina acceso a redes de talleres)
      │   └── Redes de Talleres (VEHA03, VEHA09, VEHA10)
      │       └── Categorías de Talleres (solo VEHA03)
      │           ├── Talleres Afiliados
      │           ├── Multimarcas Vehículos Ligeros
      │           └── Talleres Adicionales
      └── Vehículos Asegurados (relación M:N con pólizas)
          └── Vehículo (independiente)
              ├── Placa (única)
              ├── Marca
              ├── Modelo
              └── Año
```

### Conceptos Clave

- **Cliente**: Persona que contrata seguros en RIMAC
- **Póliza**: Contrato de seguro vehicular (puede tener múltiples pólizas activas)
- **Vehículo**: Entidad independiente que puede estar en múltiples pólizas
  - **Placa**: Identificador único del vehículo
  - **Relación M:N**: Un vehículo puede tener múltiples pólizas en el tiempo
  - Cada relación póliza-vehículo tiene fecha de inicio/fin de cobertura
- **Red de Talleres**: Conjunto de talleres afiliados identificados por códigos VEHA
  - **Códigos**: VEHA03, VEHA09, VEHA10
- **Categoría de Taller**: Clasificación de talleres (solo VEHA03)
  - NO es una jerarquía, son categorías diferentes
- **Sucursal Preferencial**: Atributo especial de sucursales (no es categoría)

### Ejemplo Práctico

**Cliente**: Juan Pérez (DNI 99999999)

**Póliza 2101|001**: Con clausula VEHA03
- **Vehículos Asegurados**:
  - Toyota Corolla 2022 (placa LGM001) - **0km (es_nuevo = TRUE)**
- **Cobertura vigente**: 2024-01-01 hasta 2025-12-31
- **Redes de Talleres**:
  - VEHA03 (Red Premier con categorías)

**Póliza 2101|058**: Con clausulas VEHA09 y VEHA10
- **Vehículos Asegurados**:
  - Audi A4 2019 (placa ABC777) - **usado (es_nuevo = FALSE)**
- **Cobertura vigente**: 2024-01-01 hasta 2025-12-31
- **Redes de Talleres**:
  - VEHA09 (Red Multimarca)
  - VEHA10 (Red Concesionarios)

---

## Nomenclatura Importante

### ✅ Términos Correctos:
- **Red de Talleres** / **Red Vehicular**: Conjunto de talleres afiliados
- **Código de Red**: VEHA03, VEHA09, VEHA10 (códigos permanentes en BD)
- **Categoría de Taller**: Clasificación dentro de una red (solo VEHA03)
- **Sucursal Preferencial**: Atributo de sucursales (no es categoría)
- **Póliza**: Contrato de seguro

### 📌 En Base de Datos:
- Tabla: `redes_talleres` → códigos: 'VEHA03', 'VEHA09', 'VEHA10'
- Tabla: `categorias_talleres` → solo para VEHA03
- Tabla: `sucursales_preferenciales` → marca sucursales preferenciales
- Tabla: `vehiculos` → independiente, sin FK a pólizas
- Tabla: `polizas_vehiculos` → relación M:N con fechas de cobertura

### 📝 Nota sobre Códigos de Documentos:
- **VEHA0306, VEHA0906, VEHA1006**: Son versiones de documentos (.docx/.pdf)
- **VEHA03, VEHA09, VEHA10**: Son códigos de red usados en BD y lógica

---

## E01: Requerimiento - Buscador de Talleres

### Problema a Resolver
Los clientes necesitan llevar su carro a un taller y actualmente deben llamar
para conocer los talleres disponibles. Buscamos habilitar un buscador web para
que el cliente conozca sus talleres disponibles en todo momento.

### Problema secundario a Resolver
Extraer información de un deducible NO parametrizado (texto plano) y retornar información estructurada:

1. **Deducible**: Monto variable a pagar (ej: "20.00%")
2. **Copago**: Monto fijo mínimo (ej: 150.00)
3. **Moneda**: USD o PEN
4. **Tipo de taller**: Concesionario o Multimarca
5. **Marca**: Marcas aplicables
6. **Talleres**: Códigos VEHA aplicables

---

## Conceptos de Negocio

### Póliza y Coberturas
- **Póliza**: Contrato con coberturas y cláusulas
- **Cobertura**: Siniestros cubiertos (ej: Choque)
- **Cláusula**: Condiciones específicas con códigos identificadores
- **Cláusula VEHA**: Representa una "red de talleres"

### Deducibles
- **Deducible**: Monto a pagar por el cliente en un siniestro
- **Parametrizado**: Estructura fija en base de datos
- **NO parametrizado**: Texto plano que debe parsearse

### Red de Talleres
- **Red de talleres**: Conjunto de talleres afiliados
- **Taller**: Proveedor del servicio de reparación
- **Sucursal**: Local físico del taller
  - **Multimarca**: Atiende todas las marcas
  - **Concesionario**: Solo marcas específicas

---

## Datos de Prueba

**Cliente DNI**: 99999999

| Póliza    | Placa  | Marca  | Año  | Es Nuevo | Códigos Red Talleres | Cobertura Vigente |
|-----------|--------|--------|------|----------|----------------------|-------------------|
| 2101\|001 | LGM001 | TOYOTA | 2022 | TRUE     | VEHA03               | 2024-01-01 a 2025-12-31 |
| 2101\|058 | ABC777 | AUDI   | 2019 | FALSE    | VEHA09, VEHA10       | 2024-01-01 a 2025-12-31 |

---

## Filtros de Búsqueda

1. **Placa**: Identificar póliza y talleres aplicables
2. **Distrito**: Ubicación geográfica
3. **Tipo Taller**: Multimarca o Concesionario
4. **10 más cercanos**: Por latitud y longitud

---

## Reglas de Negocio

### Estructura de las Redes VEHA

#### VEHA03 (Red Premier con categorías)
3 categorías de talleres:

1. **Talleres Afiliados** (Por marca específica)
   - Organizados por marca específica
   - Incluye concesionarios y servicios especializados
   - Solo atienden por marcas específicas

2. **Multimarcas Vehículos Ligeros** (Todas las marcas)
   - Atienden todas las marcas (es_multimarca = TRUE)

3. **Talleres Adicionales** (Con validación de antigüedad)
   - **RESTRICCIÓN**: Solo vehículos 0km (es_nuevo = TRUE) Y antigüedad ≤4 años
   - **PENALIZACIÓN**: Si no cumple AMBAS condiciones → recargo 50% en deducible
   - **APROBACIÓN**: Requiere aceptación de Rímac Seguros si no cumple requisitos

#### VEHA09 (Talleres Afiliados Multimarca)
- Sin categorías
- Todos los talleres atienden TODAS las marcas
- Sin restricciones de antigüedad

#### VEHA10 (Talleres Afiliados Concesionarios)
- Sin categorías
- Organizados por marca de vehículo
- Solo atienden marcas específicas
- Designación: (CONCESIONARIO) o (SERVICIO ESPECIALIZADO)

### Tipos de Designación
- **(CONCESIONARIO)**: Distribuidor oficial
- **(SERVICIO ESPECIALIZADO)**: Especialista no necesariamente oficial
- **Sin designación**: Taller sin designación especial (tipo = NULL en BD)

### Beneficios en Talleres Afiliados
Aplicables a todas las redes VEHA:
- Peritaje policial en el mismo taller
- Servicio gratuito de taxi a domicilio
- Inicio inmediato de reparación
- Certificado de garantía por 12 meses

### Sucursales Preferenciales
- Es un ATRIBUTO de sucursales, NO una categoría
- Una sucursal puede ser preferencial en una red específica
- Ejemplo: "ALMACENES SANTA CLARA" tiene 2 sucursales preferenciales en VEHA03

### Talleres en Múltiples Redes
Un mismo taller puede pertenecer a múltiples redes VEHA simultáneamente:
- Ejemplo: "ASISTENCIA AUTOMOTRIZ" está en VEHA03 (Multimarcas) y VEHA09

---

## Validaciones Obligatorias

### Por Placa
- Placa debe corresponder a vehículo con cobertura vigente del cliente autenticado
- Una placa se asocia a una única marca de vehículo

### Por Red VEHA
- Póliza debe tener al menos una cláusula VEHA activa
- Una póliza puede tener múltiples cláusulas VEHA

### Por Categoría de Taller (solo VEHA03)
- Solo VEHA03 tiene categorías

### Por Tipo de Taller
- Concesionario/Servicio Especializado: debe atender la marca del vehículo
- Multimarca: atiende cualquier marca

### Por Antigüedad del Vehículo (Talleres Adicionales)
- Se calcula: AnioActual - AnioVehículo
- Se valida TAMBIÉN: es_nuevo = TRUE (vehículo comprado 0km)
- AMBAS condiciones deben cumplirse para acceso sin recargo
- Se compara contra MaximoAnioAntiguedad configurado en BD
- Si no cumple AMBAS: se retornan flags pero NO se excluye

---

## Lógica de Búsqueda por Red VEHA

### SI póliza tiene VEHA03:
1. **Talleres Afiliados**: Filtrados por marca del vehículo
2. **Multimarcas Vehículos Ligeros**: Todas las marcas
3. **Talleres Adicionales**: Se incluyen SIEMPRE con flags de validación:
   - Si `es_nuevo = TRUE` Y `antigüedad ≤4 años`: `cumpleRequisitosAntiguedad = true`
   - Si `es_nuevo = FALSE` O `antigüedad >4 años`: `cumpleRequisitosAntiguedad = false` + flags de recargo y aprobación
   - El frontend decide cómo mostrar la advertencia

### SI póliza tiene VEHA09:
- Incluir todos los talleres (sin filtro de marca)
- Sin categorías ni restricciones

### SI póliza tiene VEHA10:
- Incluir solo talleres que atiendan la marca del vehículo

### SI póliza tiene múltiples VEHA:
- Combinar resultados de todas las redes
- Eliminar duplicados (mismo taller + misma dirección)

---

## Patrones para Parsear Deducibles

### Identificación de Valores
- **Porcentajes**: "X.XX% del monto a indemnizar"
- **Copago USD**: "mínimo US$ XXX.XX" o "mínimo USD XXX.XX"
- **Copago PEN**: "mínimo S/ XXX.XX" o "mínimo PEN XXX.XX"

### Identificación de Tipo de Taller
- **Multimarca**: "talleres afiliados multimarca"
- **Concesionario**: "concesionario" o "talleres afiliados concesionarios"
- **Genérico**: "en talleres afiliados" (sin especificar)

### Normalización
- "US$" → USD
- "S/" → PEN
- Si no especifica moneda → USD por defecto

---

## Notas Importantes

### Reglas de Integridad
1. Un taller puede tener múltiples sucursales en diferentes distritos
2. Un taller puede aparecer en múltiples redes VEHA
3. Un taller puede estar en múltiples categorías dentro de VEHA03
4. Una sucursal puede ser preferencial en una red específica
5. Un vehículo puede tener múltiples pólizas en el tiempo (renovaciones)
6. Un vehículo tiene campo `es_nuevo` que indica si fue comprado 0km sin uso previo

### Cálculo de Antigüedad y Validación (Talleres Adicionales)
- Se calcula basado en el **año del vehículo**, no la fecha de emisión de la póliza
- Fórmula: `YEAR(CURDATE()) - vehiculos.anio`
- **AMBAS condiciones deben cumplirse**:
  - `vehiculos.es_nuevo = TRUE` (comprado 0km)
  - `antigüedad <= 4 años`
- Si NO cumple AMBAS → recargo 50% + requiere aprobación Rímac