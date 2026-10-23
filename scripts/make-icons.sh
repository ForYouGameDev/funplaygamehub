#!/usr/bin/env bash
# assets/icon-only.png se Android ke saare icons banata hai (legacy + round + adaptive).
set -euo pipefail
SRC=assets/icon-only.png
R=${1:-android/app/src/main/res}
if ! command -v convert >/dev/null && ! command -v magick >/dev/null; then sudo apt-get update -y; sudo apt-get install -y imagemagick; fi
# ImageMagick 7 me "convert" ki jagah "magick" hota hai
if command -v magick >/dev/null; then convert(){ magick "$@"; }; identify(){ magick identify "$@"; }; fi
identify "$SRC"
BG=$(convert "$SRC" -format '#%[hex:p{4,4}]' info: | cut -c1-7)
echo "adaptive background: $BG"
mk() { # density legacy_px adaptive_px
  local d=$1 l=$2 a=$3 fg=$(( $3 * 66 / 100 ))
  mkdir -p "$R/mipmap-$d"
  convert "$SRC" -resize ${l}x${l} "$R/mipmap-$d/ic_launcher.png"
  convert "$SRC" -resize ${l}x${l} \( -size ${l}x${l} xc:none -fill white -draw "circle $((l/2)),$((l/2)) $((l/2)),0" \) -compose DstIn -composite "$R/mipmap-$d/ic_launcher_round.png"
  convert "$SRC" -resize ${fg}x${fg} -background none -gravity center -extent ${a}x${a} "$R/mipmap-$d/ic_launcher_fg.png"
}
mk mdpi 48 108; mk hdpi 72 162; mk xhdpi 96 216; mk xxhdpi 144 324; mk xxxhdpi 192 432
mkdir -p "$R/mipmap-anydpi-v26" "$R/values"
cat > "$R/values/ic_launcher_bg.xml" <<X
<?xml version="1.0" encoding="utf-8"?>
<resources><color name="ic_launcher_bg">$BG</color></resources>
X
for n in ic_launcher ic_launcher_round; do
cat > "$R/mipmap-anydpi-v26/$n.xml" <<X
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/ic_launcher_bg"/>
  <foreground android:drawable="@mipmap/ic_launcher_fg"/>
</adaptive-icon>
X
done
echo "icons done"
