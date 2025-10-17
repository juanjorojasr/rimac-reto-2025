Feature: DeducibleUtil - Cobertura de código al 100%

  # ============================================================================
  # PRUEBAS DE COBERTURA TÉCNICA
  # ============================================================================
  # Este archivo contiene escenarios adicionales para alcanzar 100% de cobertura
  # de código (statements, branches, functions, lines).
  #
  # NO son requerimientos del proyecto, son pruebas técnicas para cubrir
  # todos los caminos del código en deducible.util.ts
  #
  # Los casos de REQUERIMIENTOS DEL PROYECTO están en extraerDeducible.feature
  # ============================================================================

  Background:
    Given que tengo el utilty de extracción de deducibles

  # --------------------------------------------------------------------------
  # Escenarios para extracción de deducibles y copagos
  # --------------------------------------------------------------------------

  Scenario: Extraer el deducible mínimo cuando hay múltiples porcentajes
    Given un texto con múltiples porcentajes: 10%, 30%, 35%
    When ejecuto la extracción de deducible
    Then el deducible extraído debe ser 10

  Scenario: Extraer el copago mínimo cuando hay múltiples valores
    Given un texto con múltiples copagos: US$ 150, US$ 300, US$ 400
    When ejecuto la extracción de deducible
    Then el copago extraído debe ser 150

  Scenario: Detectar moneda USD correctamente
    Given un texto con moneda "US$"
    When ejecuto la extracción de deducible
    Then la moneda extraída debe ser "USD"

  # --------------------------------------------------------------------------
  # Escenarios para detección de tipos de taller
  # --------------------------------------------------------------------------

  Scenario: Detectar tipo NO TIPO cuando no hay mención específica
    Given un texto sin mencionar tipo de taller específico
    When ejecuto la extracción de deducible
    Then el tipo extraído debe ser "NO TIPO"

  Scenario: Detectar tipo Multimarca correctamente
    Given un texto que menciona "talleres afiliados multimarca"
    When ejecuto la extracción de deducible
    Then el tipo extraído debe ser "Multimarca"

  Scenario: Detectar tipo Concesionarios correctamente
    Given un texto que menciona "concesionarios"
    When ejecuto la extracción de deducible
    Then el tipo extraído debe ser "Concesionarios"

  Scenario: Detectar ambos tipos cuando se mencionan multimarca y concesionarios
    Given un texto que menciona "talleres afiliados multimarca" y "concesionarios"
    When ejecuto la extracción de deducible
    Then se deben extraer 2 deducibles con tipos diferentes

  # --------------------------------------------------------------------------
  # Escenarios para valores por defecto
  # --------------------------------------------------------------------------

  Scenario: Retornar marca y taller por defecto
    Given un texto sin mencionar marca ni taller específico
    When ejecuto la extracción de deducible
    Then la marca debe ser "NO MARCA"
    And el taller debe ser "NO TALLER"

  # --------------------------------------------------------------------------
  # Casos edge - Manejo de valores ausentes
  # --------------------------------------------------------------------------

  Scenario: Manejar texto sin porcentaje
    Given un texto sin porcentaje de deducible
    When ejecuto la extracción de deducible
    Then el deducible debe ser 0

  Scenario: Manejar texto sin copago
    Given un texto sin mención de copago
    When ejecuto la extracción de deducible
    Then el copago debe ser 0

  Scenario: Usar USD por defecto si no se especifica moneda
    Given un texto sin mención de moneda
    When ejecuto la extracción de deducible
    Then la moneda debe ser "USD" por defecto
