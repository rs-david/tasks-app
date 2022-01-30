<?php 

/* Funciones Para Trabajar Con Archivos */
function almacenarArchivo($file)
{
    $temporal_name = $file['tmp_name'];
    $new_name = $file['name'];
    $new_file_location = "files/$new_name";

    move_uploaded_file($temporal_name, "$new_file_location");

    return $new_file_location;
}
