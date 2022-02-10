<?php

session_start();
include('functions/files.php');
$file = $_FILES['file'];

if ($_SESSION["user"] && $file['type'] == 'application/json') {
    // Se Almacena El Archivo (JSON) Para Su Posterior Uso.
    $file_location = almacenarArchivo($file);
    // Obtenemos El Archivo Ya Almacenado.
    $data = file_get_contents($file_location);
    // Convertimos El Archivo En Array Asociativo.
    $records = json_decode($data, true);
    // Obtenemos La Cantidad De Registros & Creamos Un Límite.
    $total_records = count($records);
    $limit = 1000;

    // Verificamos La Cantidad De Registros.
    if ($total_records <= $limit) {
        // Válidamos El Archivo JSON.
        if (!json_last_error()) {
            // Construimos Una Consulta SQL Para Insertar Los Registros Del Array en la Base de Datos.
            $table = $_POST['table'];
            $user_id = $_SESSION["user"];

            function agregarComillasANoNumeros($value)
            {
                if (!is_integer($value) && !is_float(($value))) {
                    return "'$value'";
                } else {
                    return $value;
                }
            }

            // Creamos la Query de Valores.
            foreach ($records as $record) {
                $values = array_values($record);
                $values = array_map('agregarComillasANoNumeros', $values);
                $values = implode(',', $values);
                $values = "($user_id,$values),";
                $values_query .= $values;
            }

            $values_query = substr($values_query, 0, -1);

            // Creamos la Query de Columnas.
            $columns_query = array_keys($records[0]);
            $columns_query = implode(', ', $columns_query);
            $columns_query = "user_id, $columns_query";

            try {
                include('connection.php');

                $statement = $conn->prepare("INSERT INTO $table($columns_query) VALUES$values_query");
                $statement->execute();

                $response = ['content' => '¡Lista Guardada!', 'type' => 'success'];
            } catch (PDOException $e) {
                // Manejamos Errores De Servidor.
                $error = 'ERROR: ' . $e->getMessage();
                $response = ['content' => 'Error En El Servidor', 'type' => 'danger', 'error' => "Server Error: $error"];
            }
        } else {
            // Manejamos Errores Del JSON.
            $error = json_last_error_msg();
            $response = ['content' => 'Archivo No Válido', 'type' => 'danger', 'error' => "Invalid File: $error"];
        }
    } else {
        // Manejamos El Error De Límite De Registros.
        $response = ['content' => "Máximo $limit Registros A La Vez", 'type' => 'warning', 'error' => "Limit Exceeded: $total_records"];
    }
} else {
    // Manejamos Los Errores De Archivo No Admitido.
    $file_type = $file['type'];
    $response = ['content' => 'Archivo No Admitido', 'type' => 'warning', 'error' => "File Type Error: $file_type"];
}

// Enviamos La Respuesta.
echo json_encode($response);
