function point(x, y) {
  this.x = x;
  this.y = y;
}
function collision(lx1, ly1, rx1, ry1, lx2, ly2, rx2, ry2){
    return !(lx2 > rx1 ||
            rx2 < lx1 ||
            ly2 > ry1 ||
            ry2 < ly1);
}