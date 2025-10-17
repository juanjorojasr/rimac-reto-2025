Feature: TalleresRepository - Acceso a datos de talleres vehiculares

  Como sistema de búsqueda de talleres
  Quiero acceder a la base de datos de forma eficiente
  Para obtener información de vehículos y talleres según filtros

  # ========================================
  # obtenerVehiculoPorPlaca()
  # ========================================

  Scenario: Obtener vehículo existente por placa
    Given un cliente con DNI "99999999"
    And un vehículo con placa "LGM001" con cobertura vigente
    When consulto el vehículo por placa
    Then la query debe ejecutarse correctamente
    And debe retornar los datos del vehículo con marca y antigüedad

  Scenario: Vehículo no encontrado por placa
    Given un cliente con DNI "99999999"
    And una placa inexistente "NOEXIST"
    When consulto el vehículo por placa
    Then la query debe ejecutarse correctamente
    And debe retornar null

  # ========================================
  # buscarPorClienteYFiltros()
  # ========================================

  Scenario: Búsqueda con placa específica (delega a buscarPorVehiculoEspecifico)
    Given un cliente con DNI "99999999"
    And filtros con idPoliza 1 y placa "LGM001"
    When busco talleres con filtros
    Then debe llamar al método buscarPorVehiculoEspecifico
    And debe retornar talleres compatibles con el vehículo

  Scenario: Búsqueda sin placa (delega a buscarPorTodosLosVehiculos)
    Given un cliente con DNI "99999999"
    And filtros sin placa específica
    When busco talleres con filtros
    Then debe llamar al método buscarPorTodosLosVehiculos
    And debe retornar talleres compatibles con todos los vehículos

  # ========================================
  # buscarPorVehiculoEspecifico()
  # ========================================

  Scenario: Búsqueda de talleres para vehículo específico con filtros básicos
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And filtros de distrito "SAN ISIDRO"
    When busco talleres para el vehículo específico
    Then debe ejecutar query con JOIN de pólizas y vehículos
    And debe filtrar talleres por compatibilidad de marca
    And debe aplicar filtro de distrito
    And debe retornar talleres únicos sin duplicados

  Scenario: Búsqueda con geolocalización y cálculo de distancia
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And coordenadas latitud -12.0897 y longitud -77.0436
    And radio de búsqueda de 10 km
    When busco talleres para el vehículo específico
    Then debe incluir fórmula Haversine en el SELECT
    And debe aplicar Bounding Box en el WHERE
    And debe ordenar por distancia ascendente
    And debe filtrar talleres dentro del radio con HAVING

  Scenario: Búsqueda con top limitando resultados
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And límite top de 5 talleres
    When busco talleres para el vehículo específico
    Then debe aplicar LIMIT 5 en la query
    And debe retornar máximo 5 talleres

  Scenario: Búsqueda filtrando por tipo de taller Multimarca
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And filtro de tipo "MULTIMARCA"
    When busco talleres para el vehículo específico
    Then debe agregar condición es_multimarca = TRUE
    And debe retornar solo talleres multimarca

  Scenario: Búsqueda filtrando por tipo Concesionario
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And filtro de tipo "CONCESIONARIO"
    When busco talleres para el vehículo específico
    Then debe agregar condición tipo CONCESIONARIO o SERVICIO_ESPECIALIZADO
    And debe retornar solo concesionarios

  Scenario: Búsqueda filtrando por tipo exacto de BD (SERVICIO_ESPECIALIZADO)
    Given un cliente con DNI "99999999"
    And un vehículo Toyota con idPoliza 1 y placa "LGM001"
    And filtro de tipo exacto "SERVICIO_ESPECIALIZADO"
    When busco talleres para el vehículo específico
    Then debe agregar condición tipo exacto con parámetro
    And debe retornar talleres del tipo especificado

  # ========================================
  # buscarPorTodosLosVehiculos()
  # ========================================

  Scenario: Búsqueda combinada para múltiples vehículos
    Given un cliente con DNI "99999999"
    And el cliente tiene 2 vehículos con cobertura activa
    When busco talleres para todos los vehículos
    Then debe obtener lista de vehículos del cliente
    And debe buscar talleres para cada vehículo
    And debe agrupar talleres por nombre y dirección
    And debe agregar campo placasAtendidas con array de placas

  Scenario: Búsqueda para todos con geolocalización
    Given un cliente con DNI "99999999"
    And el cliente tiene 2 vehículos con cobertura activa
    And coordenadas latitud -12.0897 y longitud -77.0436
    When busco talleres para todos los vehículos
    Then debe buscar con coordenadas para cada vehículo
    And debe ordenar talleres agrupados por distancia
    And debe retornar talleres ordenados por cercanía

  Scenario: Búsqueda para todos con límite top
    Given un cliente con DNI "99999999"
    And el cliente tiene 2 vehículos con cobertura activa
    And límite top de 10 talleres
    When busco talleres para todos los vehículos
    Then debe agrupar resultados primero
    And debe aplicar límite después de agrupar
    And debe retornar máximo 10 talleres agrupados

  Scenario: Búsqueda para todos con filtro de tipo exacto
    Given un cliente con DNI "99999999"
    And el cliente tiene 2 vehículos con cobertura activa
    And filtro de tipo exacto "SERVICIO_ESPECIALIZADO"
    When busco talleres para todos los vehículos
    Then debe aplicar filtro de tipo exacto en las búsquedas
    And debe retornar talleres del tipo especificado

  Scenario: Cliente sin vehículos
    Given un cliente con DNI "11111111"
    And el cliente no tiene vehículos con cobertura activa
    When busco talleres para todos los vehículos
    Then debe obtener lista vacía de vehículos
    And debe retornar array vacío sin ejecutar búsquedas

  # ========================================
  # obtenerVehiculosDelCliente()
  # ========================================

  Scenario: Obtener múltiples vehículos del cliente
    Given un cliente con DNI "99999999"
    When obtengo la lista de vehículos del cliente
    Then debe ejecutar query con JOIN de pólizas activas
    And debe filtrar por cobertura vigente
    And debe retornar array con todos los vehículos

  # ========================================
  # Métodos privados de transformación
  # ========================================

  Scenario: Eliminar duplicados de talleres por nombre y dirección
    Given una lista con 3 talleres donde 2 tienen mismo nombre y dirección
    When elimino duplicados
    Then debe retornar 2 talleres únicos
    And debe mantener el primer taller encontrado

  Scenario: Agrupar talleres por placas atendidas
    Given talleres encontrados para 2 placas diferentes
    And algunos talleres atienden ambas placas
    When agrupo talleres por placas
    Then debe combinar talleres duplicados
    And debe agregar campo placasAtendidas con array de placas

  Scenario: rowToDto convierte TallerRow a TallerDto
    Given un TallerRow con todos los campos
    When convierto a DTO
    Then debe mapear correctamente todos los campos
    And debe convertir es_multimarca a boolean
    And debe parsear marcas separadas por comas

  Scenario: rowToDto con validación de antigüedad (Talleres Adicionales)
    Given un TallerRow con requiere_validacion_antiguedad = 1
    And vehículo de 2022 con es_vehiculo_nuevo = 1
    And anios_maximos_antiguedad = 4
    When convierto a DTO
    Then debe calcular cumpleRequisitosAntiguedad = true
    And debe incluir flags de validación en el DTO

  Scenario: rowToDto con vehículo que no cumple antigüedad
    Given un TallerRow con requiere_validacion_antiguedad = 1
    And vehículo de 2015 con es_vehiculo_nuevo = 0
    And anios_maximos_antiguedad = 4
    When convierto a DTO
    Then debe calcular cumpleRequisitosAntiguedad = false
    And debe incluir recargoDeducible y requiereAprobacion en el DTO
