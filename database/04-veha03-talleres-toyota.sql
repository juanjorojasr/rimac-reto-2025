-- VEHA03: Talleres para TOYOTA (Placa LGM001, Póliza 2101|001)
-- Fuente: Documento VEHA0306.docx

USE rimac_talleres;

-- IDs necesarios
SET @id_veha03 = (SELECT id FROM redes_talleres WHERE codigo = 'VEHA03');
SET @id_marca_toyota = (SELECT id FROM marcas WHERE nombre = 'TOYOTA');
SET @id_cat_afiliados = (SELECT id FROM categorias_talleres WHERE id_red_taller = @id_veha03 AND nombre = 'Talleres Afiliados');
SET @id_cat_multimarcas = (SELECT id FROM categorias_talleres WHERE id_red_taller = @id_veha03 AND nombre = 'Multimarcas Vehículos Ligeros');
SET @id_cat_adicionales = (SELECT id FROM categorias_talleres WHERE id_red_taller = @id_veha03 AND nombre = 'Talleres Adicionales');

-- SUCURSALES PREFERENCIALES (2 sucursales)
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('ALMACENES SANTA CLARA', 'CONCESIONARIO', TRUE, TRUE);
SET @id_santa_clara = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_santa_clara, 'Santa Clara - San Borja', 'Av. San Luis 2253', 'San Borja', '476-6080', -12.0897, -76.9858, TRUE),
(@id_santa_clara, 'Santa Clara - Ate', 'Av. Nicolás Ayllón 1685 Urb. Valdivieso', 'Ate', '326-4441', -12.0297, -76.9456, TRUE);

-- Marcar sucursales como preferenciales
SET @id_suc_sb = (SELECT id FROM sucursales WHERE id_taller = @id_santa_clara AND nombre_sucursal = 'Santa Clara - San Borja');
SET @id_suc_ate = (SELECT id FROM sucursales WHERE id_taller = @id_santa_clara AND nombre_sucursal = 'Santa Clara - Ate');

INSERT INTO sucursales_preferenciales (id_sucursal, id_red_taller) VALUES
(@id_suc_sb, @id_veha03),
(@id_suc_ate, @id_veha03);

-- TALLERES AFILIADOS TOYOTA

-- MITSUI AUTOMOTRIZ
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('MITSUI AUTOMOTRIZ', 'CONCESIONARIO', FALSE, TRUE);
SET @id_mitsui = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_mitsui, 'Mitsui - La Molina', 'Prolog. Javier Prado Este 6042', 'La Molina', '348-0049', -12.0797, -76.9458, TRUE),
(@id_mitsui, 'Mitsui - Canadá', 'Av. Canadá', 'La Victoria', '471-2266', -12.0697, -77.0158, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_mitsui, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_mitsui, @id_veha03, @id_cat_afiliados);

-- PANA AUTOS
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('PANA AUTOS', 'CONCESIONARIO', FALSE, TRUE);
SET @id_pana = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_pana, 'Pana Autos - San Miguel', 'Av. La Marina 3240', 'San Miguel', '464-0400', -12.0797, -77.0858, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_pana, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_pana, @id_veha03, @id_cat_afiliados);

-- PANATEC
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('PANATEC', 'CONCESIONARIO', FALSE, TRUE);
SET @id_panatec = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_panatec, 'Panatec - San Borja', 'Av. Aviación 4928', 'San Borja', '271-0060', -12.0897, -76.9858, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_panatec, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_panatec, @id_veha03, @id_cat_afiliados);

-- RESEPANA
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('RESEPANA', 'CONCESIONARIO', FALSE, TRUE);
SET @id_resepana = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_resepana, 'Resepana - San Isidro', 'Av. Rep. de Panamá 3321', 'San Isidro', '421-9100', -12.0897, -77.0258, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_resepana, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_resepana, @id_veha03, @id_cat_afiliados);

-- MARINA MOTORS
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('MARINA MOTORS', 'SERVICIO_ESPECIALIZADO', FALSE, TRUE);
SET @id_marina = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_marina, 'Marina Motors - San Miguel', 'Av. La Marina 3245', 'San Miguel', '578-2522', -12.0797, -77.0858, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_marina, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_marina, @id_veha03, @id_cat_afiliados);

-- TK SERVICE S.A.
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('TK SERVICE S.A.', NULL, FALSE, TRUE);
SET @id_tk = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_tk, 'TK Service - Chorrillos', 'Av. Guardia Peruana 1179', 'Chorrillos', '994090777', -12.1697, -77.0158, TRUE);

INSERT INTO talleres_marcas (id_taller, id_marca) VALUES (@id_tk, @id_marca_toyota);
INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_tk, @id_veha03, @id_cat_afiliados);

-- MULTIMARCAS VEHÍCULOS LIGEROS (2 talleres, 2 sucursales)

-- ASISTENCIA AUTOMOTRIZ
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('ASISTENCIA AUTOMOTRIZ', NULL, TRUE, TRUE);
SET @id_asistencia = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_asistencia, 'Asistencia Automotriz - Barranco', 'Pedro Heraud 250', 'Barranco', '247-3102', -12.1467, -77.0203, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_asistencia, @id_veha03, @id_cat_multimarcas);

-- ASSIST MOTOR
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('ASSIST MOTOR', NULL, TRUE, TRUE);
SET @id_assist_motor = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_assist_motor, 'Assist Motor - Surquillo', 'Pje. La Calera de la Merced 140-160 Alt. Cdra 11 Av. Tomas Marsano', 'Surquillo', '271-3647', -12.1097, -77.0158, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_assist_motor, @id_veha03, @id_cat_multimarcas);

-- TALLERES ADICIONALES

-- DIVEMOTORS
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('DIVEMOTORS', 'CONCESIONARIO', TRUE, TRUE);
SET @id_divemotors = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_divemotors, 'Divemotors - La Victoria', 'Av. Canadá 1160', 'La Victoria', '224-0522', -12.0697, -77.0158, TRUE),
(@id_divemotors, 'Divemotors - San Isidro', 'Av. Aramburu 1197', 'San Isidro', '475-0266', -12.0897, -77.0258, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_divemotors, @id_veha03, @id_cat_adicionales);

-- INCHCAPE MOTORS
INSERT INTO talleres (nombre, tipo, es_multimarca, activo) VALUES
('INCHCAPE MOTORS', 'CONCESIONARIO', TRUE, TRUE);
SET @id_inchcape = LAST_INSERT_ID();

INSERT INTO sucursales (id_taller, nombre_sucursal, direccion, distrito, telefono, latitud, longitud, activo) VALUES
(@id_inchcape, 'Inchcape Motors - San Isidro', 'Av. República de Panamá 3330', 'San Isidro', '222-3434', -12.0897, -77.0258, TRUE);

INSERT INTO talleres_redes (id_taller, id_red_taller, id_categoria_taller) VALUES (@id_inchcape, @id_veha03, @id_cat_adicionales);
