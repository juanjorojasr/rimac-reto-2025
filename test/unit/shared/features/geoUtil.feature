Feature: Calcular distancia geográfica
  Como sistema de geolocalización
  Quiero calcular distancias entre coordenadas
  Para ordenar talleres por cercanía

  Scenario: Calcular distancia entre dos puntos cercanos
    Given que tengo dos coordenadas en Lima
    When calculo la distancia entre ellas
    Then debo obtener una distancia en kilómetros
    And la distancia debe ser mayor a cero

  Scenario: Calcular distancia en el mismo punto
    Given que tengo las mismas coordenadas
    When calculo la distancia
    Then la distancia debe ser cero

  Scenario: Calcular distancia entre puntos lejanos
    Given que tengo coordenadas de Lima y Cusco
    When calculo la distancia
    Then debo obtener una distancia significativa
