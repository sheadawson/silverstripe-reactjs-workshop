<?php

class Event extends DataObject {

	private static $db = array(
		'Title' => 'Varchar',
		'Description' => 'HTMLText',
		'Date' => 'Date'
	);

	 private static $has_one = array(
		'EventManagerPage' => 'EventManagerPage'
	);
}
