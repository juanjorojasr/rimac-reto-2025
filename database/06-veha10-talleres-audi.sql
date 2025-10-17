-- VEHA10: Talleres Afiliados Concesionarios
-- Fuente: Documento VEHA1006.docx

USE rimac_talleres;

-- IDs necesarios
SET @id_veha10 = (SELECT id FROM redes_talleres WHERE codigo = 'VEHA10');
SET @id_marca_audi = (SELECT id FROM marcas WHERE nombre = 'AUDI');

-- TALLERES CONCESIONARIOS AUDI

-- EUROMOTORS - AUDI ZENTRUM (CONCESIONARIO)
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('EUROMOTORS - AUDI ZENTRUM', 'CONCESIONARIO', FALSE, TRUE);
SET @id_euromotors_audi = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_euromotors_audi, 'Audi Zentrum - Surquillo', 'Av. Domingo Orué 989', 'Surquillo', '221-7022', -12.1097, -77.0158, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_euromotors_audi, @id_marca_audi);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES
(@id_euromotors_audi, @id_veha10, NULL);

-- AUTOS AMERICANOS
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('AUTOS AMERICANOS', NULL, FALSE, TRUE);
SET @id_autos_americanos = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_autos_americanos, 'Autos Americanos - San Luis', 'Av. La Rosa Toro 1250', 'San Luis', '346-4735', -12.0797, -76.9758, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_autos_americanos, @id_marca_audi);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES
(@id_autos_americanos, @id_veha10, NULL);
