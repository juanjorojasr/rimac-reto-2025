USE rimac_talleres;

-- FOREIGN KEYS - TABLAS PRINCIPALES

-- Tabla: categorias_talleres
ALTER TABLE categorias_talleres
  ADD CONSTRAINT fk_categorias_redes
  FOREIGN KEY (id_red_taller) REFERENCES redes_talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: modelos
ALTER TABLE modelos
  ADD CONSTRAINT fk_modelos_marcas
  FOREIGN KEY (id_marca) REFERENCES marcas(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: polizas
ALTER TABLE polizas
  ADD CONSTRAINT fk_polizas_clientes
  FOREIGN KEY (id_cliente) REFERENCES clientes(id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Tabla: vehiculos (independiente, sin FK a polizas)
ALTER TABLE vehiculos
  ADD CONSTRAINT fk_vehiculos_marcas
  FOREIGN KEY (id_marca) REFERENCES marcas(id)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_vehiculos_modelos
  FOREIGN KEY (id_modelo) REFERENCES modelos(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Tabla: clausulas
ALTER TABLE clausulas
  ADD CONSTRAINT fk_clausulas_redes
  FOREIGN KEY (id_red_taller) REFERENCES redes_talleres(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Tabla: sucursales
ALTER TABLE sucursales
  ADD CONSTRAINT fk_sucursales_talleres
  FOREIGN KEY (id_taller) REFERENCES talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- FOREIGN KEYS - TABLAS M:N

-- Tabla: polizas_vehiculos
ALTER TABLE polizas_vehiculos
  ADD CONSTRAINT fk_polizas_vehiculos_polizas
  FOREIGN KEY (id_poliza) REFERENCES polizas(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_polizas_vehiculos_vehiculos
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: polizas_clausulas
ALTER TABLE polizas_clausulas
  ADD CONSTRAINT fk_polizas_clausulas_polizas
  FOREIGN KEY (id_poliza) REFERENCES polizas(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_polizas_clausulas_clausulas
  FOREIGN KEY (id_clausula) REFERENCES clausulas(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: polizas_coberturas
ALTER TABLE polizas_coberturas
  ADD CONSTRAINT fk_polizas_coberturas_polizas
  FOREIGN KEY (id_poliza) REFERENCES polizas(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_polizas_coberturas_coberturas
  FOREIGN KEY (id_cobertura) REFERENCES coberturas(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: talleres_redes
ALTER TABLE talleres_redes
  ADD CONSTRAINT fk_talleres_redes_talleres
  FOREIGN KEY (id_taller) REFERENCES talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_talleres_redes_redes
  FOREIGN KEY (id_red_taller) REFERENCES redes_talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_talleres_redes_categorias
  FOREIGN KEY (id_categoria_taller) REFERENCES categorias_talleres(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Tabla: talleres_marcas
ALTER TABLE talleres_marcas
  ADD CONSTRAINT fk_talleres_marcas_talleres
  FOREIGN KEY (id_taller) REFERENCES talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_talleres_marcas_marcas
  FOREIGN KEY (id_marca) REFERENCES marcas(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: sucursales_preferenciales
ALTER TABLE sucursales_preferenciales
  ADD CONSTRAINT fk_sucursales_preferenciales_sucursales
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_sucursales_preferenciales_redes
  FOREIGN KEY (id_red_taller) REFERENCES redes_talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla: redes_talleres_beneficios
ALTER TABLE redes_talleres_beneficios
  ADD CONSTRAINT fk_redes_beneficios_redes
  FOREIGN KEY (id_red_taller) REFERENCES redes_talleres(id)
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_redes_beneficios_beneficios
  FOREIGN KEY (id_beneficio) REFERENCES beneficios(id)
  ON DELETE CASCADE ON UPDATE CASCADE;
