<?php

class EventManagerAdmin extends ModelAdmin {

	private static $managed_models = array(
		'Event',
	);

	private static $url_segment = 'events';

	private static $menu_title = 'Event Manager';
}
