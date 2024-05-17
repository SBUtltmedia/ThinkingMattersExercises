imageWidth=966
imagePadding=50
convert '/Users/xiqchen/Documents/ThinkingMattersExercises/movement/img/39-man-walking-cycle-2d-front-side-gif.gif' xx_%05d.png
mkdir cropped
for i in *.png                            
do convert $i -chop 0x50 +repage cropped/$i
done
mkdir padded
for i in *.png    
do convert cropped/$i -background white  -splice ${imagePadding}x0 padded/$i 
done
mkdir front
for i in *.png    
do convert padded/$i  -gravity east -chop $(((imagePadding+imageWidth)/2))x0 front/$i 
done
mkdir back
for i in *.png    
do convert front/$i  -flop back/$i 
done
mkdir right
for i in *.png    
do convert padded/$i  -gravity west -chop $(((imagePadding+imageWidth)/2))x0 right/$i 
done
mkdir left
for i in *.png    
do convert right/$i  -flop left/$i 
done
mkdir montage
montage   -mode concatenate -tile 24x1 right/* montage/right.png
montage  -mode concatenate  -tile 24x1 left/*  montage/left.png
montage  -mode concatenate -tile 24x1 front/* montage/front.png
montage  -mode concatenate -tile 24x1  back/* montage/back.png
montage  -mode concatenate  -tile 1x4 montage/right.png montage/left.png montage/front.png montage/back.png montage/sheet.png
convert montage/sheet.png    -threshold 90%  montage/sheetBW.png
convert montage/sheetBW.png montage/sheet.svg