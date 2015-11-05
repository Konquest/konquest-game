/**
 * The HeadlessRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class HeadlessRenderer
 * @constructor
 * @param [width=800] {Number} the width of the canvas view
 * @param [height=600] {Number} the height of the canvas view
 * @param [options] {Object} The optional renderer parameters. There are none, but keeping the interface.
 */
var HeadlessRenderer = module.exports = function(width, height, options) {
  /**
   * The width of the canvas view
   *
   * @property width
   * @type Number
   * @default 800
   */
  this.width = width || 800;

  /**
   * The height of the canvas view
   *
   * @property height
   * @type Number
   * @default 600
   */
  this.height = height || 600;

  /**
   * The canvas element that everything is drawn to.
   *
   * @property view
   * @type HTMLCanvasElement
   */
  this.view = options.view || PIXI.CanvasPool.create(this, this.width, this.height)

  /**
   * The canvas 2d context that everything is drawn with
   * @property context
   * @type CanvasRenderingContext2D
   */
  this.context = this.view.getContext("2d", { alpha: this.transparent })
}

HeadlessRenderer.prototype.destroy = function(removeView) {
  if (!removeView === undefined) {
    removeView = true
  }

  if (removeView && this.view.parent) {
    this.view.parent.removeChild(this.view)
  }

  this.view = null
  this.context = null
};

/**
 * Resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
HeadlessRenderer.prototype.resize = function(width, height)
{
    this.width = width
    this.height = height

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize) {
        this.view.style.width = this.width + "px";
        this.view.style.height = this.height + "px";
    }
};

HeadlessRenderer.prototype.render = function(stage) {
    // Do nothing
};
