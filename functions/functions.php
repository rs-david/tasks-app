<?php

function almacenarArchivo($name)
{
    $temporal_name = $_FILES["$name"]['tmp_name'];
    $name = $_FILES["$name"]['name'];
    $url = "upload/$name";

    move_uploaded_file($temporal_name, "$url");

    return $url;
}
