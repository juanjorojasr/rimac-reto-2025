-- Ejemplo 1: TOYOTA Corolla 2022 (Placa LGM001, Póliza 2101|001, Red VEHA03)
-- Ejemplo 2: AUDI A4 2019 (Placa ABC777, Póliza 2101|058, Redes VEHA09+VEHA10)

USE rimac_talleres;

-- CLIENTES
INSERT INTO clientes (dni, nombres, apellidos, email, telefono) VALUES
('99999999', 'Cliente', 'Demo', 'cliente.demo@rimac.com.pe', '987654321');

-- MARCAS
INSERT INTO marcas (nombre, nombre_normalizado) VALUES
('TOYOTA', 'toyota'),
('AUDI', 'audi');

-- MODELOS
INSERT INTO modelos (id_marca, nombre, anio_inicio, anio_fin) VALUES
(1, 'Corolla', 1966, NULL),
(2, 'A4', 1994, NULL);

-- REDES DE TALLERES
INSERT INTO redes_talleres (codigo, nombre, descripcion) VALUES
('VEHA03', 'Talleres Afiliados Premier', 'Red de talleres concesionarios por marca y distintas categorías'),
('VEHA09', 'Talleres Afiliados Multimarca', 'Red de talleres multimarca sin categorías'),
('VEHA10', 'Talleres Afiliados Concesionarios', 'Red de talleres concesionarios por marca');

-- CATEGORÍAS DE TALLERES (Solo para VEHA03)
-- Nota: "Talleres Preferenciales" NO es una categoría, es un ATRIBUTO
--       Esto se registra en la tabla sucursales_preferenciales
INSERT INTO categorias_talleres
  (id_red_taller, nombre, orden, requiere_validacion_antiguedad, anios_maximos_antiguedad, recargo_deducible, requiere_aprobacion)
VALUES
  (1, 'Talleres Afiliados', 1, FALSE, NULL, 0.00, FALSE),
  (1, 'Multimarcas Vehículos Ligeros', 2, FALSE, NULL, 0.00, FALSE),
  (1, 'Talleres Adicionales', 3, TRUE, 4, 0.50, TRUE);

-- POLIZAS
INSERT INTO polizas (numero, id_cliente, estado, fecha_inicio, fecha_fin) VALUES
('2101|001', 1, 'activa', '2024-01-01', '2025-12-31'),
('2101|058', 1, 'activa', '2024-01-01', '2025-12-31');

-- VEHICULOS (independientes)
INSERT INTO vehiculos (placa, id_marca, id_modelo, anio, es_nuevo) VALUES
('LGM001', 1, 1, 2022, TRUE),   -- Toyota Corolla 2022 (0km, cumple ambas condiciones)
('ABC777', 2, 2, 2019, FALSE);  -- Audi A4 2019 (usado, no cumple condiciones)

-- POLIZAS Y VEHICULOS (relación M:N)
INSERT INTO polizas_vehiculos (id_poliza, id_vehiculo, fecha_inicio_cobertura, fecha_fin_cobertura) VALUES
(1, 1, '2024-01-01', '2025-12-31'),  -- Póliza 2101|001 → Toyota Corolla (LGM001)
(2, 2, '2024-01-01', '2025-12-31');  -- Póliza 2101|058 → Audi A4 (ABC777)

-- COBERTURAS - Solo Choque para el ejemplo
INSERT INTO coberturas (codigo, nombre, descripcion) VALUES
('COB001', 'Choque', 'Daños por colisión con otro vehículo u objeto');

-- CLAUSULAS
-- Cláusulas Generales
INSERT INTO clausulas (codigo, tipo, descripcion, id_red_taller) VALUES
('VEA01', 'GENERAL', 'Incendio por corto circuito sí es cubierto', NULL);

-- Cláusulas VEHA
INSERT INTO clausulas (codigo, tipo, descripcion, id_red_taller) VALUES
('VEHA03', 'VEHA', 'Acceso a Talleres Afiliados Premier', 1),
('VEHA09', 'VEHA', 'Acceso a Talleres Afiliados Multimarca', 2),
('VEHA10', 'VEHA', 'Acceso a Talleres Afiliados Concesionarios', 3);

-- BENEFICIOS (Aplican a todas las redes)
INSERT INTO beneficios (descripcion, orden) VALUES
('Peritaje policial de daños en el mismo taller', 1),
('Servicio gratuito de taxi a su domicilio', 2),
('Inicio inmediato de los trabajos de reparación', 3),
('Certificado de garantía por 12 meses', 4);

-- REDES Y BENEFICIOS
INSERT INTO redes_talleres_beneficios (id_red_taller, id_beneficio) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),  -- VEHA03
(2, 1), (2, 2), (2, 3), (2, 4),  -- VEHA09
(3, 1), (3, 2), (3, 3), (3, 4);  -- VEHA10

-- POLIZAS Y CLAUSULAS
INSERT INTO polizas_clausulas (id_poliza, id_clausula) VALUES
(1, 2),  -- Póliza 2101|001 → VEHA03
(2, 3),  -- Póliza 2101|058 → VEHA09
(2, 4);  -- Póliza 2101|058 → VEHA10

-- POLIZAS Y COBERTURAS
INSERT INTO polizas_coberturas (id_poliza, id_cobertura) VALUES
(1, 1),  -- Póliza 2101|001 → Choque
(2, 1);  -- Póliza 2101|058 → Choque
