var Timeline = (function (window, document, undefined) {
	/**
	 * Timeline component
	 *
	 * @param {String} url The JSON data url for timeline
	 */
	function Timeline(url) {
		this.url = url;
	}

	// Timeline template
	Timeline.prototype.template =
		'<div id="timeline">' +
			'<div id="frames"></div>' +
			'<button id="control"></button>' +
		'</div>';

	/**
	 * Render this Timeline to the DOM
	 *
	 * @param {Element} parent The element to render this Timeline to
	 */
	Timeline.prototype.render = function (parent) {
		var frag = document.createElement('div');
		frag.innerHTML = this.template;

		this.element = frag.firstElementChild;
		parent = parent || document.body;
		parent.appendChild(this.element);

		// Initialize state
		this.reset();

		this.fetch(function (data) {
			// Make sure data and events exist
			if (!data || !data.events) {
				return;
			}

			// Get frames and clear content
			var frames = document.getElementById('frames');
			frames.innerHTML = '';

			// Render title frame
			var title = document.createElement('div');
			title.className = 'frame active';
			title.innerHTML = data.firstName + ' ' + data.lastName;
			frames.appendChild(title);

			// Render event frames
			for (var i=0, l=data.events.length; i<l; i++) {
				var event = data.events[i],
					frame = document.createElement('div');

				frame.className = 'frame staged';
				frame.innerHTML = 'At age ' + event.age + ', ' + data.firstName + ' ' + event.content;

				frames.appendChild(frame);
			}
		});
	};

	/**
	 * Fetch the data from the server
	 *
	 * @param {Function} callback The function to invoke once data has been fetched
	 */
	Timeline.prototype.fetch = function (callback) {
		if (typeof this.data === 'undefined') {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				try {
					this.data = JSON.parse(this.responseText);
					callback(this.data);
				} catch (e) {
					// Ignore exception
					// This may happen if url cannot be resolved
					// Or if response is not parsable as JSON
				}
			};
			xhr.open('GET', this.url, true);
			xhr.send();
		} else {
			callback(this.data);
		}
	};

	/**
	 * Constants for the state of the Timeline
	 */
	var State = {
		PLAY: 'Play',
		PAUSE: 'Pause',
		RESET: 'Reset'
	};

	Timeline.prototype.__state = function (state) {
		if (state) {
			var button = this.element.querySelector('#control'),
				self = this;
			button.innerHTML = state;
			button.onclick = function () {
				self[state.toLowerCase()]();
			};
		}
	};

	/**
	 * Play this Timeline
	 */
	Timeline.prototype.play = function () {
		this.__state(State.PAUSE);
	};

	/**
	 * Pause this Timeline
	 */
	Timeline.prototype.pause = function () {
		this.__state(State.PLAY);
	};

	/**
	 * Reset this Timeline
	 */
	Timeline.prototype.reset = function () {
		this.__state(State.PLAY);
	};

	return Timeline;
})(window, document);
