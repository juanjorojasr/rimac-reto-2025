Feature: Buscar talleres disponibles
  Como cliente de RIMAC con seguro vehicular
  Quiero buscar talleres disponibles según mi póliza
  Para conocer dónde puedo llevar mi vehículo a reparación

  Background:
    Given que soy un cliente autenticado con DNI "99999999"

  Scenario: Buscar talleres con placa válida
    Given que tengo un vehículo con placa "LGM001"
    When busco talleres para mi vehículo
    Then debo recibir una lista de talleres disponibles
    And los talleres deben pertenecer a las redes VEHA de mi póliza

  Scenario: Buscar talleres sin especificar placa
    When busco talleres sin especificar una placa
    Then debo recibir talleres compatibles con todos mis vehículos

  Scenario: Buscar talleres con placa inválida
    Given que tengo una placa "INVALIDA" que no me pertenece
    When busco talleres para esa placa
    Then debo recibir una lista vacía de talleres

  Scenario: Buscar talleres con filtro de distrito
    Given que tengo un vehículo con placa "LGM001"
    And quiero buscar en el distrito "LA MOLINA"
    When busco talleres aplicando el filtro de distrito
    Then debo recibir solo talleres ubicados en "LA MOLINA"

  Scenario: Buscar talleres multimarca
    Given que tengo un vehículo con placa "LGM001"
    And quiero buscar talleres tipo "MULTIMARCA"
    When busco talleres aplicando el filtro de tipo
    Then debo recibir solo talleres multimarca

  Scenario: Buscar talleres con geolocalización
    Given que tengo un vehículo con placa "LGM001"
    And proporciono coordenadas de geolocalización
    When busco talleres cercanos
    Then debo recibir talleres ordenados por distancia
    And cada taller debe incluir su distancia en kilómetros
