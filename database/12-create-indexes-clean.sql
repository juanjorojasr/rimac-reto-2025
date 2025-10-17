USE rimac_talleres;

-- ÍNDICES PARA BÚSQUEDAS GEOGRÁFICAS

-- Sucursales: optimización de búsquedas por ubicación
CREATE INDEX idx_sucursales_latitud ON sucursales(latitud);
CREATE INDEX idx_sucursales_longitud ON sucursales(longitud);
CREATE INDEX idx_sucursales_geo_activo ON sucursales(latitud, longitud, activo);
CREATE INDEX idx_sucursales_distrito ON sucursales(distrito);

-- ÍNDICES PARA BÚSQUEDAS FRECUENTES

-- Clientes: búsqueda por DNI
CREATE INDEX idx_clientes_dni ON clientes(dni);

-- Pólizas: búsquedas por cliente y estado
CREATE INDEX idx_polizas_cliente ON polizas(id_cliente);
CREATE INDEX idx_polizas_estado ON polizas(estado);
CREATE INDEX idx_polizas_numero ON polizas(numero);

-- Vehículos: búsquedas por placa y marca
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_vehiculos_marca ON vehiculos(id_marca);

-- Modelos: búsqueda por marca
CREATE INDEX idx_modelos_marca ON modelos(id_marca);

-- Marcas: búsqueda por nombre normalizado
CREATE INDEX idx_marcas_normalizado ON marcas(nombre_normalizado);

-- Clausulas: filtros por tipo y red
CREATE INDEX idx_clausulas_tipo ON clausulas(tipo);
CREATE INDEX idx_clausulas_red ON clausulas(id_red_taller);

-- Talleres: filtros por tipo y multimarca
CREATE INDEX idx_talleres_tipo ON talleres(tipo);
CREATE INDEX idx_talleres_multimarca ON talleres(es_multimarca);
CREATE INDEX idx_talleres_activo ON talleres(activo);

-- Sucursales: búsquedas por taller y estado
CREATE INDEX idx_sucursales_taller ON sucursales(id_taller);
CREATE INDEX idx_sucursales_activo ON sucursales(activo);

-- Categorías de talleres: búsqueda por red
CREATE INDEX idx_categorias_red ON categorias_talleres(id_red_taller);

-- ÍNDICES PARA TABLAS M:N

-- polizas_vehiculos
CREATE INDEX idx_polizas_vehiculos_poliza ON polizas_vehiculos(id_poliza);
CREATE INDEX idx_polizas_vehiculos_vehiculo ON polizas_vehiculos(id_vehiculo);
CREATE INDEX idx_polizas_vehiculos_cobertura_activa ON polizas_vehiculos(id_vehiculo, fecha_fin_cobertura);

-- polizas_clausulas
CREATE INDEX idx_polizas_clausulas_poliza ON polizas_clausulas(id_poliza);
CREATE INDEX idx_polizas_clausulas_clausula ON polizas_clausulas(id_clausula);

-- polizas_coberturas
CREATE INDEX idx_polizas_coberturas_poliza ON polizas_coberturas(id_poliza);
CREATE INDEX idx_polizas_coberturas_cobertura ON polizas_coberturas(id_cobertura);

-- talleres_redes
CREATE INDEX idx_talleres_redes_taller ON talleres_redes(id_taller);
CREATE INDEX idx_talleres_redes_red ON talleres_redes(id_red_taller);
CREATE INDEX idx_talleres_redes_categoria ON talleres_redes(id_categoria_taller);

-- talleres_marcas
CREATE INDEX idx_talleres_marcas_taller ON talleres_marcas(id_taller);
CREATE INDEX idx_talleres_marcas_marca ON talleres_marcas(id_marca);

-- sucursales_preferenciales
CREATE INDEX idx_sucursales_preferenciales_sucursal ON sucursales_preferenciales(id_sucursal);
CREATE INDEX idx_sucursales_preferenciales_red ON sucursales_preferenciales(id_red_taller);

-- redes_talleres_beneficios
CREATE INDEX idx_redes_beneficios_red ON redes_talleres_beneficios(id_red_taller);
CREATE INDEX idx_redes_beneficios_beneficio ON redes_talleres_beneficios(id_beneficio);

-- ÍNDICES COMPUESTOS PARA QUERIES COMPLEJOS

-- Búsqueda de talleres activos por red y categoría
CREATE INDEX idx_talleres_redes_busqueda
ON talleres_redes(id_red_taller, id_categoria_taller, id_taller);

-- Búsqueda de sucursales activas por distrito y geolocalización
CREATE INDEX idx_sucursales_busqueda
ON sucursales(distrito, activo, latitud, longitud);

-- Pólizas activas por cliente
CREATE INDEX idx_polizas_cliente_activas
ON polizas(id_cliente, estado);

-- Vehículos asegurados con cobertura vigente
CREATE INDEX idx_polizas_vehiculos_vigentes
ON polizas_vehiculos(id_poliza, id_vehiculo, fecha_inicio_cobertura, fecha_fin_cobertura);