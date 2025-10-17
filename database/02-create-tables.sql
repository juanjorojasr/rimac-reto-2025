USE rimac_talleres;

-- Tabla: clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(8) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: marcas
CREATE TABLE marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  nombre_normalizado VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: modelos
CREATE TABLE modelos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_marca INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  anio_inicio INT,
  anio_fin INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_marca_modelo (id_marca, nombre)
);

-- Tabla: redes_talleres
CREATE TABLE redes_talleres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: categorias_talleres
-- Solo aplica para VEHA03
CREATE TABLE categorias_talleres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_red_taller INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  orden INT NOT NULL,
  requiere_validacion_antiguedad BOOLEAN DEFAULT FALSE,
  anios_maximos_antiguedad INT,
  recargo_deducible DECIMAL(5,2) DEFAULT 0.00,
  requiere_aprobacion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: polizas
CREATE TABLE polizas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL UNIQUE,
  id_cliente INT NOT NULL,
  estado ENUM('activa', 'suspendida', 'cancelada', 'vencida') DEFAULT 'activa',
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: vehiculos (independiente)
CREATE TABLE vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(10) NOT NULL UNIQUE,
  id_marca INT NOT NULL,
  id_modelo INT,
  anio INT,
  es_nuevo BOOLEAN DEFAULT FALSE COMMENT 'TRUE si fue comprado 0km sin uso previo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: coberturas
CREATE TABLE coberturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: clausulas
CREATE TABLE clausulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  tipo ENUM('GENERAL', 'VEHA') NOT NULL,
  descripcion TEXT,
  id_red_taller INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: talleres
CREATE TABLE talleres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255),
  tipo ENUM('CONCESIONARIO', 'SERVICIO_ESPECIALIZADO') NULL COMMENT 'Designación especial del taller. NULL indica taller sin designación especial',
  es_multimarca BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: sucursales
CREATE TABLE sucursales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_taller INT NOT NULL,
  nombre_sucursal VARCHAR(255) NOT NULL,
  direccion VARCHAR(500) NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  telefono VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: beneficios
CREATE TABLE beneficios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(500) NOT NULL,
  orden INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación: polizas <-> vehiculos
CREATE TABLE polizas_vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_poliza INT NOT NULL,
  id_vehiculo INT NOT NULL,
  fecha_inicio_cobertura DATE NOT NULL,
  fecha_fin_cobertura DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_poliza_vehiculo_activo (id_poliza, id_vehiculo, fecha_fin_cobertura)
);

-- Relación: polizas <-> clausulas
CREATE TABLE polizas_clausulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_poliza INT NOT NULL,
  id_clausula INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_poliza_clausula (id_poliza, id_clausula)
);

-- Relación: polizas <-> coberturas
CREATE TABLE polizas_coberturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_poliza INT NOT NULL,
  id_cobertura INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_poliza_cobertura (id_poliza, id_cobertura)
);

-- Relación: talleres <-> redes_talleres
-- Con categoría opcional (solo VEHA03)
CREATE TABLE talleres_redes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_taller INT NOT NULL,
  id_red_taller INT NOT NULL,
  id_categoria_taller INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_taller_red_categoria (id_taller, id_red_taller, id_categoria_taller)
);

-- Relación: talleres <-> marcas (solo si es_multimarca = false)
CREATE TABLE talleres_marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_taller INT NOT NULL,
  id_marca INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_taller_marca (id_taller, id_marca)
);

-- Relación: sucursales_preferenciales <-> redes_talleres
-- Registra qué SUCURSALES tienen el atributo "Preferencial" en una red VEHA específica
-- Nota: Una sucursal de un taller puede ser preferencial mientras que otras del mismo taller no
CREATE TABLE sucursales_preferenciales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_sucursal INT NOT NULL,
  id_red_taller INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_sucursal_red_preferencial (id_sucursal, id_red_taller)
);

-- Relación: redes_talleres <-> beneficios
CREATE TABLE redes_talleres_beneficios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_red_taller INT NOT NULL,
  id_beneficio INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_red_beneficio (id_red_taller, id_beneficio)
);

