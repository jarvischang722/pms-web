/**
 * Created by Jun on 2017/5/17.
 * 顏色色碼轉換工具
 */

var colorTool = {
    //RGB 轉 16進位色碼
    rgbToHex: function (r, g, b) {
        return (r < 16 ? "0" + r.toString(16).toUpperCase() : r.toString(16).toUpperCase()) + (g < 16 ? "0" + g.toString(16).toUpperCase() : g.toString(16).toUpperCase()) + (b < 16 ? "0" + b.toString(16).toUpperCase() : b.toString(16).toUpperCase());
    },

    //16進位色碼轉RGB
    hexToRgb: function (h) {
        var lo_rgb = {
            r: parseInt(h[0], 16) * 16 + parseInt(h[1], 16),
            g: parseInt(h[2], 16) * 16 + parseInt(h[3], 16),
            b: parseInt(h[4], 16) * 16 + parseInt(h[5], 16)
        };
        return lo_rgb;
    },
    //反轉成RGB
    colorCodToRgb: function (colorCod) {
        colorCod = Number(colorCod);
        var lo_color = {r: 0, g: 0, b: 0};
        var remainder = Math.floor(colorCod % 65536);
        lo_color.b = Math.floor(colorCod / 65536);
        lo_color.g = Math.floor(remainder / 256);
        remainder = Math.floor(colorCod % 256);
        lo_color.r = remainder;
        return lo_color;

    },
    //RGB轉Color Code
    rgbToColorCod: function (rgb) {
        return (65536 * rgb.b) + (256 * rgb.g) + rgb.r
    },
    //反轉成16進位
    colorCodToHex: function (colorCod) {
        colorCod = Number(colorCod);
        var lo_rgb = colorTool.colorCodToRgb(colorCod);
        return colorTool.rgbToHex(lo_rgb.r, lo_rgb.g, lo_rgb.b);
    },
    //反轉成16進位
    hexToColorCod: function (h) {
        h = h.replace("#", "");
        var lo_rgb = colorTool.hexToRgb(h);
        return colorTool.rgbToColorCod(lo_rgb);
    }
};