app.directive('maslPresentation', function () {
	'use strict';
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="presentation">' +
                        '<active-slide><active-slide/>' +
                    '</div>'
    };
});

app.directive('activeSlide', function () {
	'use strict';
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="slide in presentation.slides | filter:{ active: true }" class="slide">' +
                        '<slide-items></slide-items>' +
                    '</div>'
    };
});

app.directive('slideItems', function () {
    'use strict';
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        // Bindonce attribute is important for item directive
        template:   '<div bindonce ng-repeat="item in slide.items" class="item-wrapper">' +
                        '<item></item>' +
                    '</div>'
    };
});

app.directive('item', function () {
	'use strict';
    function link(scope, element, attrs) {
        element.on('click', function (event) {
            var that = $(this);
			
            // If the element has been moved dont fire click event (would unselect) 
            if (that.hasClass('being-moved')) {
                that.removeClass('being-moved');
                return;
            }
			
			// Same if it is being resized
			if (that.hasClass('being-resized')) {
				that.removeClass('being-resized');
				return;
			}
			
            // Get controls for this item
            var item_id = that.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // The already selected item was clicked (unselect it)
            if (that.hasClass('selected-object')) {
				that.blur(); // Removes focus so keydown is nto fired for this anymore
                that.removeClass('selected-object');
                item_controls.addClass('sidebar-gone');
                item_controls.addClass('hidden');
                $('#item-controls-button').addClass('inactive');
                
            // A previously unselected item has been clicked
            } else {
                var old_item_controls, reopen_controls;
                
                var old_item = $('.selected-object');
                var old_item_id = old_item.attr('id');

                // If there is a previously selected item, unselect it and clean up
                if (old_item_id) {
                    old_item_id = old_item_id.replace('item-', '');
                    
                    old_item_controls = $('#controls-' + old_item_id);
                    
                    reopen_controls = !(old_item_controls.hasClass('hidden') ||
                          old_item_controls.hasClass('sidebar-gone'));
                    old_item_controls.addClass('sidebar-gone');
                    old_item_controls.addClass('hidden');
                    
                    old_item.removeClass('selected-object');
                }
                
				// Focus clicked item to enable keydown event
				that.focus();
				
                // Select clicked item
                that.addClass('selected-object');
				
				// Show controls if they were open for the previous item
                item_controls.removeClass('hidden');
                if (reopen_controls) {
                    item_controls.removeClass('sidebar-gone');
                }
                
                // Enable the control panel toggle
                $('#item-controls-button').removeClass('inactive');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
            var start_x, start_y;
            var x_input, y_input;
          
            var that = $(this);
            var item_id = that.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // If the item is selected and not being resized, move it
            if (that.hasClass('selected-object') && !that.hasClass('being-resized')) {
                x_input = item_controls.find('[ng-model="item.location[0]"]');
                y_input = item_controls.find('[ng-model="item.location[1]"]');
                
                start_x = event.pageX - x_input.val();
                start_y = event.pageY - y_input.val();
                
                $(document).on('mousemove', mousemove);
                $(document).on('mouseup', mouseup);
            }
            
            function mousemove(event) {
                that.addClass('being-moved');
                x_input.val(event.pageX - start_x).change();
                y_input.val(event.pageY - start_y).change();
            }

            function mouseup() {
                $(document).unbind('mousemove', mousemove);
                $(document).unbind('mouseup', mouseup);
            }
        });
        
		element.on('keydown', function(event) {
			var key = event.keyCode || event.charCode;
			var rate = event.shiftKey ? 1 : 10;
			var that = $(this);
			var item_id = that.attr('id').replace('item-', '');
			var item_controls = $('#controls-' + item_id);
			var left_input = item_controls.find('[ng-model="item.location[0]"]');
			var top_input  = item_controls.find('[ng-model="item.location[1]"]');
			var rotation_input  = item_controls.find('[ng-model="item.rotation"]');
			
			if (event.altKey) {
				switch (key) {
					// arrow-left
					case 37: 
						rotation_input.val(rotation_input.val() - rate).change();
						return false;

					// arrow-up
					case 38: 
						rotation_input.val(rotation_input.val() - rate).change();
						return false;

					// arrow-right
					case 39: 
						rotation_input.val(rotation_input.val()/1 + rate).change();
						return false;

					//arrow-down
					case 40: 
						rotation_input.val(rotation_input.val()/1 + rate).change();
						return false;

					// something else
					default: break;
				}
			} else {
				switch (key) {
					// delete
					case 46:
						item_controls.find('.delete-btn').click();
						return false;

					// escape
					case 27: 
						that.click();
						return false;

					// arrow-left
					case 37: 
						left_input.val(left_input.val() - rate).change();
						return false;

					// arrow-up
					case 38: 
						top_input.val(top_input.val() - rate).change();
						return false;

					// arrow-right
					case 39: 
						left_input.val(left_input.val()/1 + rate).change();
						return false;

					//arrow-down
					case 40: 
						top_input.val(top_input.val()/1 + rate).change();
						return false;

					// something else
					default: break;
				}
			}
		});
		
        // Prevent accidental 'text' selection on double click
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    // Binding of all the attributes to the corresponding style
    var style = 'position:          absolute;' +
                'height:            {{item.height}}px;' +
                'width:             {{item.width}}px;' +
                '-webkit-transform: translateX({{item.location[0]}}px) ' +
								    'translateY({{item.location[1]}}px) ' +
								    'rotate({{item.rotation}}deg);' +
                'transform:         translateX({{item.location[0]}}px) ' +
								    'translateY({{item.location[1]}}px) ' +
								    'rotate({{item.rotation}}deg);' +
                'background:        {{item.style.background}};' +
                'border:            {{item.style.border}};' +
                'border-radius:     {{item.style.border_radius}}%;' +
				'z-index:           {{item.layer}};' +
                'text-align:        {{item.text.align}};' +
                'font-size:         {{item.text.size}}rem;' +
                'font-weight:       {{item.text.format}};' +
                'color:             {{item.text.color}};';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        // bo-id gets the id from the model and then removes the watcher (the id should not change anymore)
        template:   '<div tabindex="0" bo-id="\'item-\' + item.id" class="item" style="' + style + '">' +
                        '<item-turner></item-turner>' +
                        '<item-corner corner-position="top-left"></item-corner>' +
                        '<item-corner corner-position="bottom-left"></item-corner>' +
                        '<item-corner corner-position="bottom-right"></item-corner>' +
                        '<item-corner corner-position="top-right"></item-corner>' +
                        '{{item.text.content}}' +
                    '</div>'
    };
});

app.directive('itemCorner', function () {
    'use strict';
    function link(scope, element, attrs) {
        element.on('mousedown', function (event) {
            event.preventDefault();
            
            var start_width, start_height;
            var width, height;
            var start_x, start_y;
            var old_x, old_y;
            var x, y;
            
            var that = $(this);

            // Get item this corner belongs to
            var parent = that.parent();
            
            // Add being resized flag to prevent move of item on mousemove
            parent.addClass('being-resized');
            
            // Get controls for this item
            var item_id = parent.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // Get input fields from controls
            var x_input = item_controls.find('[ng-model="item.location[0]"]');
            var y_input = item_controls.find('[ng-model="item.location[1]"]');
            var width_input  = item_controls.find('[ng-model="item.width"]');
            var height_input = item_controls.find('[ng-model="item.height"]');

            // Set needed variables to needed values and bind needed function
			
			// Deal with top right corner drag
            if (that.hasClass('corner-top-right')) {
                start_width  = event.pageX - width_input.val();
                start_height = height_input.val();
                
                start_y = event.pageY - y_input.val();
                old_y   = event.pageY;
                
                $(document).on('mousemove', resizeFromTopRight);
            }
            
			// Deal with top left corner drag
            else if (that.hasClass('corner-top-left')) {
                start_width  = width_input.val();
                start_height = height_input.val();
                
                start_y = event.pageY - y_input.val();
                start_x = event.pageX - x_input.val();
                
                old_x = event.pageX;
                old_y = event.pageY;
                
                $(document).on('mousemove', resizeFromTopLeft);
            }
            
			// Deal with bottom left corner drag
            else if (that.hasClass('corner-bottom-left')) {
                start_width  = width_input.val();
                start_height = event.pageY - height_input.val();
                
                start_x = event.pageX - x_input.val();
                old_x   = event.pageX;
                
                $(document).on('mousemove', resizeFromBottomLeft);
            }
            
			// Deal with bottom right corner drag
            else {
                start_width  = event.pageX - width_input.val();
                start_height = event.pageY - height_input.val();
                
                $(document).on('mousemove', resizeFromBottomRight);
            }
            
			// Additionally bind mouseup event
            $(document).on('mouseup', mouseup);
            
			// Individual resize calculations
			/* 
			 * Html Objects are anchored at their top left
			 * corner, therefore items have to be moved as well
			 * when they are being rezised to stick to the cursor!
			 */
            function resizeFromTopRight(event) {
                width  = event.pageX - start_width;
                height = start_height / 1 + (old_y - event.pageY);
                y      = event.pageY - start_y;

                width_input.val(width).change();
                height_input.val(height).change();
                y_input.val(y).change();
            }
			
            function resizeFromTopLeft(event) {
                width  = start_width / 1 + (old_x - event.pageX);
                height = start_height / 1 + (old_y - event.pageY);
                x = event.pageX - start_x;
                y = event.pageY - start_y;

                width_input.val(width).change();
                height_input.val(height).change();
                x_input.val(x).change();
                y_input.val(y).change();
            }
            
            function resizeFromBottomLeft(event) {
                width  = start_width / 1 + (old_x - event.pageX);
                height = event.pageY - start_height;
                x      = event.pageX - start_x;

                width_input.val(width).change();
                height_input.val(height).change();
                x_input.val(x).change();
            }
            
            function resizeFromBottomRight(event) {
                width  = event.pageX - start_width;
                height = event.pageY - start_height;

                width_input.val(width).change();
                height_input.val(height).change();
            }
			
            // Cleanup
            function mouseup() {
                $(document).unbind('mousemove', resizeFromTopRight);
                $(document).unbind('mousemove', resizeFromTopLeft);
                $(document).unbind('mousemove', resizeFromBottomLeft);
                $(document).unbind('mousemove', resizeFromBottomRight);
                $(document).unbind('mouseup', mouseup);
            }
        });
		
		// Prevent accidental 'text' selection on double click
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    return {
        restrict: 'E',
        //require: ['^cornerPosition'],  // NOT INCLUDED SINCE IT THROWS ERRORS WHEN USED IN CONJUNCTION WITH THE 'link' ATTRIBUTE!
        scope: {
            cornerPosition: '@'
        },
        replace: true,
        link: link,
        template:   '<div class="item-corner corner-{{cornerPosition}}"></div>'
    };
});

app.directive('itemTurner', function () {
    'use strict';
    function link(scope, element, attrs) {
        
		element.on('mousedown', function (event) {
			event.preventDefault();
			var rotation;
			var that = $(this);
			
			// Get item this corner belongs to
			var parent = that.parent();

			// Add being resized flag to prevent move of item on mousemove
			parent.addClass('being-resized'); // TODO being-rotated

			// Get controls for this item
			var item_id = parent.attr('id').replace('item-', '');
			var item_controls = $('#controls-' + item_id);

			// Get input field from controls
			var input = item_controls.find('[ng-model="item.rotation"]');

			var start_mouse_x = event.pageX;
			var start_rotation = parseInt(input.val());

			$(document).on('mousemove', rotate);
			$(document).on('mouseup', mouseup);

			function rotate(event) {
				rotation = (event.pageX - start_mouse_x)/2 + start_rotation;
				input.val(rotation).change();
			}

			// Cleanup
			function mouseup() {
				$(document).unbind('mousemove', rotate);
				$(document).unbind('mouseup', mouseup);
			}
		});
	}
    
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        link: link,
        template:   '<div class="item-turner"></div>'
    };
});