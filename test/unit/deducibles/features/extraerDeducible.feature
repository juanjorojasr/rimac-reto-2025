Feature: Procesar deducible

  Scenario: Caso 1 - Póliza con excepciones y copago
    Given la póliza tiene un deducible en forma de texto con múltiples excepciones
    When ejecutamos el conversor de deducible
    Then obtenemos el deducible 10%, copago US$ 150.00, moneda USD, tipo NO TIPO

  Scenario: Caso 2 - Póliza con talleres especiales VEHA07
    Given la póliza tiene un deducible con talleres especiales VEHA07
    When ejecutamos el conversor de deducible
    Then obtenemos el deducible 20%, copago US$ 200, moneda USD, tipo NO TIPO

  Scenario: Caso 3 - Póliza con múltiples tipos de talleres
    Given la póliza tiene un deducible con múltiples tipos de talleres
    When ejecutamos el conversor de deducible
    Then obtenemos 2 deducibles con diferentes tipos y copagos

  Scenario: Caso 4 - Póliza con ausencia de control
    Given la póliza tiene un deducible por ausencia de control con múltiples talleres
    When ejecutamos el conversor de deducible
    Then obtenemos 2 deducibles por ausencia de control con diferentes copagos

  Scenario: Caso 5 - Póliza con múltiples líneas sin marcadores
    Given la póliza tiene un deducible con múltiples líneas que mencionan talleres
    When ejecutamos el conversor de deducible
    Then obtenemos 2 deducibles de las líneas con información completa

  Scenario: Caso 6 - Póliza con talleres específicos por nombre
    Given la póliza tiene un deducible con talleres específicos por nombre
    When ejecutamos el conversor de deducible
    Then obtenemos 2 deducibles con nombres de talleres específicos

  Scenario: Caso 7 - Ausencia de control en taller específico con nombre en mayúsculas
    Given la póliza tiene un deducible por ausencia de control en un taller específico
    When ejecutamos el conversor de deducible
    Then obtenemos 1 deducible con nombre de taller en mayúsculas

  Scenario: Caso 8 - Póliza con múltiples líneas y extracción de marca de vehículo
    Given la póliza tiene múltiples líneas con y sin marcas de vehículos específicas
    When ejecutamos el conversor de deducible
    Then obtenemos 4 deducibles donde 2 tienen marca específica y 2 no

