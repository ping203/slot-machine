/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var HTML, columns, result;

    HTML = ['<div class="slot-item',
        '">\
                <div class="slot-item-inner"></div>\
            </div>'];


    $(document).ready(run);
    
    console.log(createjs);
 
    function drawMap(map) {
        map = map || GameLogic.generateMap(); 
        columns.forEach(function (item, index) {
            item.empty(); 
            var children = map[index];
            var newChild;
            for (var i = 0; i < children.length; i++) {
                newChild = HTML[0] + ' position' + i + ' slot-' + children[i] + HTML[1];
                item.append(newChild);
            }
        });
    }

    function startRotateAnimation() {
        columns.forEach(function (item, index) {
            nextStep(item);
        });
        setTimeout(endGame, 1000);
    }

    function startGame() {
        $('#quay').attr('disabled', 'disabled');
        columns.forEach(function (item, index) {
            item.removeClass('vibrate-effect endingPhase1 endingPhase2 endingPhase3');
            item.status = 0;
            (function (item) {
                setTimeout(function () {
                    item.addClass('vibrate-effect')
                }, 0);
            })(item);
            if (index == 0) {
                item.one("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function () {
                    setTimeout(startRotateAnimation, 200);
                });
            }
        });
    }
    function endGame(map) {
        result = GameLogic.generateMap();
        setTimeout(function () {
            columns.forEach(function (item, index) {
                (function (item, index) {
                    setTimeout(function () {
                        item.addClass('endingPhase1');
                        item.status = 1;
                    }, index * 350);
                })(item, index);
            });
        }, 1000);
    }

    function run() {
        columns = [$('#column-1'), $('#column-2'), $('#column-3'), $('#column-4'), $('#column-5')];
        drawMap();
        $('#quay').click(startGame);
        return;
    }

    function nextStep(item) {
        var newItemValue, itemIndex = $('#gamePlay').children().index(item);
        if (item.status == 4) {
            newItemValue = result[itemIndex][0];
        } else if (item.status == 3) {
            newItemValue = result[itemIndex][1];
        } else if (item.status == 2) {
            newItemValue = result[itemIndex][2];
        } else {
            newItemValue = Math.floor(Math.random() * 10);
        }
        var newChild = HTML[0] + ' position-1' + ' slot-' + newItemValue + HTML[1];
        item.prepend(newChild);

        setTimeout(function () {
            var children = item.children();
            children.each(function (idx, val) {
                var _self = this;
                var el = $(this);
                if (idx == 0) {
                    (function (item, index) {
                        setTimeout(function () {
                            item.addClass('position' + index).removeClass('position' + (index - 1));
                        }, 0);
                    })(el, idx);
                } else {
                    el.addClass('position' + idx).removeClass('position' + (idx - 1));
                }
                if (idx == 3) {
                    $(this).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                        if (item.status == 4) {
                            if (itemIndex >= 4) {
                                $('#quay').removeAttr("disabled");
                            }
                        } else {
                            if (item.status == 1) {
                                item.status = 2;
                                item.addClass('endingPhase2');
                            } else if (item.status == 2) {
                                item.status = 3;
                                item.addClass('endingPhase3');
                            } else if (item.status == 3) {
                                item.status = 4;
                            }
                            nextStep(item);
                        }

                        item.children(":last-child").remove();
                    });
                }
            });
        }, 0);
    }
})();


