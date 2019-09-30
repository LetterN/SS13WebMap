#!/bin/bash

image="BoxStation"
format=".png"
increments=512
z_level=1

size=$( magick identify -ping -format "%wx%h" "${image}" )
x_upb=${size%x*}
y_upb=${size#*x}

echo "Image: ${image}${format}, Increment: ${increments}, Z-Level: ${z_level}"
echo "X: ${size%x*} y: ${size#*x}"

x_inc=$increments
y_inc=$increments
x_tile=$increments
y_tile=$increments

out_x=0
out_y=0

for ((x=0; x<x_upb; x+=x_inc))
do
    for ((y=0; y<y_upb; y+=y_inc))
    do
        magick convert "${image}" -crop "${x_tile}x${y_tile}+${x}+${y}" "${image}_${out_x}_${out_y}_${z_level}${format}"
        echo "Done: {X: ${out_x}, Y: ${out_y}}"
        ((out_y += 1))
    done
    ((out_x += 1))
    echo "Done ${out_x} out of ${out_y}"  
    ### treating the variable as equal, ie x and y is the same
    ((out_y = 0)) ##reset when done looping
done