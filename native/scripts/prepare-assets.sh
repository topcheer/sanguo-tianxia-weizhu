#!/bin/bash
# prepare-assets.sh —— 把仓库素材复制进 App 资源目录并生成 App 图标。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NATIVE="$ROOT/native"
RES="$NATIVE/App/Resources"

# 1) 头像
mkdir -p "$RES/Portraits"
rsync -a --delete "$ROOT/assets/portraits/san9/" "$RES/Portraits/"
echo "portraits: $(ls "$RES/Portraits" | wc -l | tr -d ' ') files"

# 2) 图标:从 PWA 512 图生成多尺寸 iconset
ICON_SRC="$ROOT/assets/icons/icon-512.png"
ICONSET="$NATIVE/App/Assets.xcassets/AppIcon.appiconset"
mkdir -p "$ICONSET"
for spec in "16 1" "16 2" "32 1" "32 2" "128 1" "128 2" "256 1" "256 2"; do
  set -- $spec; SIZE=$1; SCALE=$2
  OUT_SIZE=$((SIZE * SCALE))
  sips -z $OUT_SIZE $OUT_SIZE "$ICON_SRC" --out "$ICONSET/icon-${SIZE}@${SCALE}x.png" >/dev/null
done
cat > "$ICONSET/Contents.json" <<'EOF'
{
  "images" : [
    { "filename" : "icon-16@1x.png", "idiom" : "mac", "scale" : "1x", "size" : "16x16" },
    { "filename" : "icon-16@2x.png", "idiom" : "mac", "scale" : "2x", "size" : "16x16" },
    { "filename" : "icon-32@1x.png", "idiom" : "mac", "scale" : "1x", "size" : "32x32" },
    { "filename" : "icon-32@2x.png", "idiom" : "mac", "scale" : "2x", "size" : "32x32" },
    { "filename" : "icon-128@1x.png", "idiom" : "mac", "scale" : "1x", "size" : "128x128" },
    { "filename" : "icon-128@2x.png", "idiom" : "mac", "scale" : "2x", "size" : "128x128" },
    { "filename" : "icon-256@1x.png", "idiom" : "mac", "scale" : "1x", "size" : "256x256" },
    { "filename" : "icon-256@2x.png", "idiom" : "mac", "scale" : "2x", "size" : "256x256" },
    { "filename" : "icon-512@2x.png", "idiom" : "ios-marketing", "scale" : "1x", "size" : "1024x1024" },
    { "filename" : "icon-256@2x.png", "idiom" : "universal", "platform" : "ios", "size" : "1024x1024" }
  ],
  "info" : { "author" : "xcode", "version" : 1 }
}
EOF
sips -z 1024 1024 "$ICON_SRC" --out "$ICONSET/icon-512@2x.png" >/dev/null
cat > "$NATIVE/App/Assets.xcassets/Contents.json" <<'EOF'
{ "info" : { "author" : "xcode", "version" : 1 } }
EOF
echo "icons: generated"
echo "DONE prepare-assets"
