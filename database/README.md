# Base de Datos - RIMAC Buscador de Talleres

## Descripción

Base de datos MySQL para el sistema de búsqueda de talleres RIMAC. Implementa el modelo de negocio con **vehículos independientes** según documentación oficial:

**Cliente → Póliza → Vehículos (M:N) → Clausulas VEHA → Redes de Talleres → Categorías (solo VEHA03) → Talleres → Sucursales**

## Arquitectura de Datos

### Modelo de Vehículos Independientes
- **Tabla `vehiculos`**: Entidad independiente sin FK a pólizas
- **Tabla `polizas_vehiculos`**: Relación M:N con fechas de cobertura
- **Ventajas**:
  - Un vehículo puede tener múltiples pólizas en el tiempo (renovaciones)
  - Historial completo de coberturas por vehículo
  - No duplica vehículos al cambiar/renovar póliza

## Estructura

### Tablas Principales

#### Entidades de Negocio
1. **clientes** - Información de clientes RIMAC
2. **marcas** - Catálogo de marcas de vehículos
3. **modelos** - Modelos de vehículos por marca
4. **polizas** - Contratos de seguro vehicular
5. **vehiculos** - Vehículos (independientes, sin FK a pólizas)
6. **talleres** - Talleres afiliados (matriz/empresa)
7. **sucursales** - Sucursales físicas de talleres con geolocalización

#### Relaciones M:N
8. **polizas_vehiculos** - Relación M:N con fechas de cobertura
9. **polizas_clausulas** - Pólizas y clausulas VEHA
10. **polizas_coberturas** - Pólizas y coberturas contratadas

#### Coberturas y Clausulas
11. **coberturas** - Tipos de siniestros cubiertos (ej: Choque, Robo)
12. **clausulas** - Condiciones específicas (incluye clausulas VEHA)

#### Redes de Talleres
13. **redes_talleres** - Códigos VEHA oficiales (**VEHA03**, **VEHA09**, **VEHA10**)
14. **categorias_talleres** - 3 categorías para VEHA03:
    - Talleres Afiliados (por marca)
    - Multimarcas Vehículos Ligeros
    - Talleres Adicionales (restricción ≤4 años)
15. **talleres_redes** - Relación M:N talleres ↔ redes
16. **talleres_marcas** - Marcas atendidas por talleres no multimarca
17. **sucursales_preferenciales** - Atributo especial de sucursales

#### Beneficios
18. **beneficios** - Servicios adicionales (peritaje, taxi, garantía)
19. **redes_talleres_beneficios** - Beneficios por red

## Datos de Prueba

### Cliente Demo
- **DNI:** 99999999
- **Nombre:** Cliente Demo

### Pólizas y Vehículos
- **2101|001** - Con clausula VEHA03
  - **Vehículos asegurados**:
    - **LGM001** - TOYOTA Corolla 2022 (**0km, es_nuevo = TRUE**)
  - **Cobertura vigente**: 2024-01-01 hasta 2025-12-31
  - **Antigüedad vehículo**: 3 años (cumple AMBOS requisitos Talleres Adicionales)

- **2101|058** - Con clausulas VEHA09 y VEHA10
  - **Vehículos asegurados**:
    - **ABC777** - AUDI A4 2019 (**usado, es_nuevo = FALSE**)
  - **Cobertura vigente**: 2024-01-01 hasta 2025-12-31
  - **Antigüedad vehículo**: 6 años (no cumple requisitos Talleres Adicionales)

### Redes de Talleres (códigos oficiales)
- **VEHA03** - Talleres Afiliados Premier (con 3 categorías)
- **VEHA09** - Talleres Afiliados Multimarca (sin categorías)
- **VEHA10** - Talleres Afiliados Concesionarios (sin categorías)

### Categorías de Talleres (solo VEHA03)
1. **Talleres Afiliados** - Organizados por marca específica
2. **Multimarcas Vehículos Ligeros** - Atienden todas las marcas
3. **Talleres Adicionales** - Validación doble: vehículo 0km Y antigüedad ≤4 años
   - `requiere_validacion_antiguedad = TRUE`
   - `anios_maximos_antiguedad = 4`
   - `recargo_deducible = 0.50` (50%)
   - `requiere_aprobacion = TRUE`
   - **AMBAS condiciones obligatorias**: `es_nuevo = TRUE` AND `antigüedad ≤ 4`

### Sucursales Preferenciales (VEHA03)
- **ALMACENES SANTA CLARA**:
  - Sucursal San Borja (Av. San Luis 2253)
  - Sucursal Ate (Av. Nicolás Ayllón 1685)

### Talleres en VEHA03 (Toyota)
- **Talleres Afiliados**: 6 talleres, 8 sucursales (MITSUI, PANA AUTOS, PANATEC, RESEPANA, MARINA MOTORS, TK SERVICE)
- **Multimarcas**: 2 talleres, 2 sucursales (ASISTENCIA AUTOMOTRIZ, ASSIST MOTOR)
- **Talleres Adicionales**: 2 talleres, 3 sucursales (DIVEMOTORS, INCHCAPE MOTORS)

### Talleres en VEHA09 (Multimarca)
- 2 talleres multimarca, 2 sucursales

### Talleres en VEHA10 (Audi)
- 2 talleres concesionarios Audi, 2 sucursales

## Modelo de Negocio (Arquitectura Actualizada)

### Jerarquía según documentación oficial

```
Cliente
  └── Póliza (múltiples pólizas activas)
      ├── Vehículos (relación M:N via polizas_vehiculos)
      │   └── Vehículo (independiente)
      │       ├── Placa (única)
      │       ├── Marca (FK a marcas)
      │       ├── Modelo (FK a modelos)
      │       └── Año
      ├── Clausulas (múltiples clausulas, incluye VEHA)
      │   └── Red de Talleres (VEHA03, VEHA09, VEHA10)
      │       ├── Categorías (solo VEHA03)
      │       └── Talleres → Sucursales
      │           └── Sucursales Preferenciales (atributo)
      └── Coberturas (múltiples coberturas contratadas)
          └── Deducibles (texto plano a parsear)
```

### Cambios Arquitectónicos Importantes

#### ✅ Implementado (modelo de vehículos independientes)
- Tabla `vehiculos` sin FK a `polizas`
- Tabla `polizas_vehiculos` (M:N) con fechas de cobertura
- Tabla `categorias_talleres` (antes: categorias_jerarquicas_talleres)
- Tabla `sucursales_preferenciales` (atributo, no categoría)
- Validación de cobertura vigente en `polizas_vehiculos`
- Cálculo de antigüedad basado en año del vehículo, no póliza
- Flags de validación en response (solo Talleres Adicionales)

#### 📝 Nota sobre Códigos VEHA
- **Códigos de Red**: `VEHA03`, `VEHA09`, `VEHA10` (identificadores permanentes en BD)
- **Códigos de Documento**: `VEHA0306`, `VEHA0906`, `VEHA1006` (versiones de archivos .docx/.pdf)
- El sistema usa códigos de red para lógica de negocio, no versiones de documentos

### Reglas de Negocio

1. **Un cliente** puede tener múltiples pólizas activas
2. **Un vehículo** es independiente y puede tener múltiples pólizas en el tiempo
3. **Relación M:N** entre pólizas y vehículos con fechas de cobertura
4. **Una póliza** tiene múltiples clausulas (relación M:N en `polizas_clausulas`)
5. **Clausulas VEHA** determinan acceso a redes de talleres
6. **Un taller** puede pertenecer a múltiples redes VEHA
7. **VEHA03** tiene 3 categorías:
   - Talleres Afiliados (por marca específica)
   - Multimarcas Vehículos Ligeros (todas las marcas)
   - Talleres Adicionales (validación de antigüedad ≤4 años)
8. **VEHA09** y **VEHA10** NO tienen categorías (`id_categoria_taller = NULL`)
9. **Talleres Adicionales**: Flags informativos en response, NO se excluyen
10. **Sucursales Preferenciales**: Atributo registrado en tabla separada
11. **Deducibles**: No se persisten en BD, se parsean en tiempo real desde texto plano
12. **Búsqueda por placa**: valida cobertura vigente en `polizas_vehiculos`

## Notas Importantes

### Tipos de Taller
- **CONCESIONARIO**: Distribuidor oficial (atiende marcas específicas)
- **SERVICIO_ESPECIALIZADO**: Especialista no oficial (atiende marcas específicas)
- **Sin designación**: Taller sin designación especial

### Campo `es_multimarca`
- `TRUE`: Atiende todas las marcas (sin restricción)
- `FALSE`: Solo atiende marcas en `talleres_marcas`

### Categorías de Talleres (solo VEHA03)
- Solo aplicable a **VEHA03**, otras redes tienen `id_categoria_taller = NULL`
- NO son "jerárquicas", son categorías diferentes
- Cada categoría tiene configuración independiente en `categorias_talleres`

### Sucursales Preferenciales
- Es un ATRIBUTO de sucursales, NO una categoría
- Se registra en tabla `sucursales_preferenciales`
- Una sucursal puede ser preferencial en una red específica

### Validación de Antigüedad (Talleres Adicionales)
- Campo `requiere_validacion_antiguedad` en `categorias_talleres`
- Campo `es_nuevo` en `vehiculos` (TRUE si comprado 0km)
- Se calcula: `YEAR(CURDATE()) - vehiculos.anio`
- **AMBAS condiciones deben cumplirse**:
  - `vehiculos.es_nuevo = TRUE`
  - `antigüedad <= anios_maximos_antiguedad` (4 años)
- Si NO cumple AMBAS, se retornan flags pero NO se excluye
- Flags retornados en TallerDto:
  - `requiereValidacionAntiguedad`: boolean
  - `aniosMaximosAntiguedad`: number
  - `recargoDeducible`: number (0.50 = 50%)
  - `requiereAprobacion`: boolean
  - `cumpleRequisitosAntiguedad`: boolean (calculado con ambas condiciones)
