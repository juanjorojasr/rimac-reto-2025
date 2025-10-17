Feature: Endpoint de búsqueda de talleres
  Como API REST
  Quiero proporcionar un endpoint para buscar talleres
  Para que los clientes puedan consultar talleres disponibles

  Scenario: Buscar talleres exitosamente
    Given que tengo un request válido con placa
    When llamo al endpoint buscar talleres
    Then debo recibir una respuesta exitosa
    And la respuesta debe contener talleres
    And el código de estado debe ser 200

  Scenario: Manejar error en búsqueda de talleres
    Given que ocurre un error en el servicio
    When llamo al endpoint buscar talleres
    Then debo recibir una respuesta de error
    And el código de estado debe ser 500
