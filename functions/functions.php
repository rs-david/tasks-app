<?php

function spanishMonth($month_number)
{
    $spanish_months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    for ($i = 0; $i < count($spanish_months); $i++) {
        if ($month_number == $i + 1) {
            $spanish_month = $spanish_months[$i];
            return $spanish_month;
        }
    }
}

function almacenarArchivo($name)
{
    $temporal_name = $_FILES["$name"]['tmp_name'];
    $name = $_FILES["$name"]['name'];
    $url = "upload/$name";

    move_uploaded_file($temporal_name, "$url");

    return $url;
}
