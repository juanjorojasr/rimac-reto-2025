-- VEHA09: Talleres Afiliados Multimarca
-- Fuente: Documento VEHA0906.docx

USE rimac_talleres;

-- ID de red VEHA09
SET @id_veha09 = (SELECT id FROM redes_talleres WHERE codigo = 'VEHA09');

-- TALLERES MULTIMARCA

-- ASISTENCIA AUTOMOTRIZ
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('ASISTENCIA AUTOMOTRIZ', NULL, TRUE, TRUE);
SET @id_asistencia = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_asistencia, 'Asistencia Automotriz - Barranco', 'Pedro Heraud 250', 'Barranco', '247-3102', -12.1467, -77.0203, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES
(@id_asistencia, @id_veha09, NULL);

-- ASSIST MOTOR
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('ASSIST MOTOR', NULL, TRUE, TRUE);
SET @id_assist_motor = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_assist_motor, 'Assist Motor - Surquillo', 'Pje. La Calera de la Merced 140-160 Alt. Cdra 11 Av. Tomas Marsano', 'Surquillo', '271-3647', -12.1097, -77.0158, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES
(@id_assist_motor, @id_veha09, NULL);
