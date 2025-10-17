Feature: Endpoint de extracción de deducibles
  Como API REST
  Quiero proporcionar un endpoint para extraer deducibles
  Para procesar textos y retornar información estructurada

  Scenario: Extraer deducible exitosamente
    Given que tengo un request válido con texto
    When llamo al endpoint extraer deducible
    Then debo recibir un payload con deducibles
    And el código de estado debe ser 200

  Scenario: Extraer múltiples deducibles
    Given que tengo un texto con múltiples tipos
    When llamo al endpoint extraer deducible
    Then debo recibir múltiples deducibles en el payload
