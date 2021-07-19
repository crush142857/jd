(function () {
  // 轮播图插件

  // 轮播图需求的分析
  //   1. 轮播图的位置不同  (可想到的方案有： 将位置传入插件中 或者 通过jq选择器选中这个位置)
  //   2. 轮播图的内容不同 （传递的内容应该是一个结构div/dom的列表） content
  //   3. 大小不同  width  height
  //   4. 动画方式不同   type: fade | animate
  //   5. 是否自动轮播
  //   6. 是否有小圆点
  //   7. 左右按钮显示的形态（一直显示always， 鼠标移入显示hover， 一直不显示hide）
  //   8. 切换的时间间隔

  // $.extend({add: function(a,b) {return a + b}})  工具类方法  直接拿过来就可以用的 $.add(1,2)
  // $.fn.extend({add: function(a,b) {return a + b}})   实例方法  $(selector).add(3,2);
  // prototype 原型上的方法是谁来用的  实例用的
  /**
   * @param {options} options
   *        content: $('.item'),轮播图的内容
            width: 500, 轮播内容的宽度
            height: 400, 轮播内容的高度
            type: 'fade', 动画方式
            isAuto: true,  是否自动轮播
            showSpots: true,是否有小圆点
            showChangeBtn: 'always',  左右按钮显示的形态
            autoChangeTime: 3000切换的时间间隔
            spotsPosition: 小圆点的位置
   * @param {selector} wrap 插入轮播图的区域
   * 
   */
  function Swiper(options, wrap) {
    this.content = options.content || [];
    this.len = this.content.length;
    this.width = options.width || wrap.width();
    this.height = options.height || wrap.height();
    this.type = options.type || "fade";
    this.isAuto = options.isAuto === undefined ? true : options.isAuto;
    this.showSpots = options.showSpots === undefined ? true : options.showSpots;
    this.showChangeBtn = options.showChangeBtn || "always";
    this.autoChangeTime = options.autoChangeTime || 5000;
    this.wrap = wrap;
    this.spotsPosition = options.spotsPosition || "left";
    this.currentIndex = 0;
    // 当前动画是否完成
    this.lock = true;
    this.timer = null;
  }

  // 创建轮播图的结构
  Swiper.prototype.createDom = function () {
    var swiperWrapper = $("<div class = 'my-swiper'></div>");
    var swiperContent = $("<ul class = 'my-swiper-content'></ul>");
    var leftBtn = $("<div class = 'my-swiper-btn my-swiper-lbtn'>&lt</div>");
    var rightBtn = $("<div class = 'my-swiper-btn my-swiper-rbtn'>&gt;</div>");
    var spotsWrapper = $("<div class = 'my-swiper-stops'></div>");
    for (var i = 0; i < this.len; i++) {
      $("<li></li>").html(this.content[i]).appendTo(swiperContent);
      $("<span class = my-swiper-stop></span>").appendTo(spotsWrapper);
    }
    if (this.type == "animate") {
      $("<li></li>")
        .html($(this.content[0]).clone(true))
        .appendTo(swiperContent);
    }
    spotsWrapper.css({
      textAlign: this.spotsPosition,
    });
    $(swiperWrapper)
      .append(swiperContent)
      .append(leftBtn)
      .append(rightBtn)
      .append(spotsWrapper)
      .appendTo(this.wrap)
      .addClass("my-swiper-" + this.type);
  };
  // 动态设置样式
  Swiper.prototype.initStyle = function () {
    $(this.wrap).find(".my-swiper").css({
      width: this.width,
      height: this.height,
    });
    // 设置父级宽度使轮播内容可以排一列
    if (this.type == "animate") {
      $(this.wrap)
        .find(".my-swiper .my-swiper-content")
        .css({
          width: (this.len + 1) * this.width,
          left: 0,
        });
    } else {
      $(this.wrap)
        .find(".my-swiper .my-swiper-content li")
        .hide()
        .eq(this.currentIndex)
        .show();
    }
    // 给索引添加高亮
    $(this.wrap)
      .find(".my-swiper .my-swiper-stops .my-swiper-stop")
      .eq(this.currentIndex)
      .addClass("spot-active");
    // 左右按钮是否显示
    if (this.showChangeBtn == "always") {
      $(this.wrap).find(".my-swiper-btn").show();
    } else if (this.showChangeBtn == "hide") {
      $(this.wrap).find(".my-swiper-btn").hide();
    } else {
      $(this.wrap).find(".my-swiper-btn").hide();
      $(this.wrap)
        .mouseenter(function () {
          $(this).find(".my-swiper-btn").fadeIn();
        })
        .mouseleave(function () {
          $(this).find(".my-swiper-btn").fadeOut();
        });
    }
    // 小圆点是否显示
    if (!this.showSpots) {
      $(this.wrap).find(".my-swiper-stops").hide();
    }
  };
  // 轮播图行为绑定
  Swiper.prototype.bindEvent = function () {
    var self = this;
    $(this.wrap)
      .find(".my-swiper-lbtn")
      .click(function () {
        // 如果当前动画没有完成就不进行下次动画
        if (!self.lock) {
          return false;
        }
        self.lock = false;
        if (self.currentIndex === 0) {
          if (self.type === "animate") {
            $(self.wrap)
              .find(".my-swiper .my-swiper-content")
              .css({
                left: -self.len * self.width,
              });
          }
          self.currentIndex = self.len - 1;
        } else {
          self.currentIndex--;
        }
        self.change();
      })
      .end()
      .find(".my-swiper-rbtn")
      .click(function () {
        // 如果当前动画没有完成就不进行下次动画
        if (!self.lock) {
          return false;
        }
        self.lock = false;
        if (self.type == "fade" && self.currentIndex == self.len - 1) {
          self.currentIndex = 0;
        } else if (self.type == "animate" && self.currentIndex == self.len) {
          $(self.wrap).find(".my-swiper .my-swiper-content").css({
            left: 0,
          });
          self.currentIndex = 1;
        } else {
          self.currentIndex++;
        }
        self.change();
      });
    $(this.wrap)
      .find(".my-swiper-stops span")
      .mouseenter(function () {
        self.currentIndex = $(this).index();
        self.change();
      })
      .end()
      .mouseenter(function () {
        clearInterval(self.timer);
      })
      .mouseleave(function () {
        if (self.isAuto) {
          self.autoChange();
        }
      });
  };
  //切换功能封装
  Swiper.prototype.change = function () {
    var self = this;
    if (this.type == "fade") {
      $(this.wrap)
        .find(".my-swiper-content li")
        .fadeOut()
        .eq(this.currentIndex)
        .fadeIn(function () {
          self.lock = true;
        });
    } else {
      $(this.wrap)
        .find(".my-swiper-content")
        .animate(
          {
            left: -this.currentIndex * this.width,
          },
          function () {
            self.lock = true;
          }
        );
    }
    $(this.wrap)
      .find(".my-swiper .my-swiper-stops .my-swiper-stop")
      .removeClass("spot-active")
      .eq(this.currentIndex % this.len)
      .addClass("spot-active");
  };
  // 自动轮播方法
  Swiper.prototype.autoChange = function () {
    var self = this;
    this.timer = setInterval(function () {
      $(self.wrap).find(".my-swiper-rbtn").trigger("click");
    }, this.autoChangeTime);
  };
  // 初始化方法
  Swiper.prototype.init = function () {
    this.createDom();
    this.initStyle();
    this.bindEvent();
    if (this.isAuto) {
      this.autoChange();
    }
  };
  $.fn.extend({
    swiper: function (options) {
      var obj = new Swiper(options, this);
      obj.init();
    },
  });
})();
