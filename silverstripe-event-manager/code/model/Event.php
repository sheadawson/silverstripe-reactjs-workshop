<?php

class Event extends DataObject {

	private static $db = array(
		'Title' => 'Varchar',
		'Description' => 'Text',
		'Date' => 'Date'
	);

	private static $has_one = array(
		'EventManagerPage' => 'EventManagerPage'
	);

	public function onAfterWrite() {
		parent::onAfterWrite();

		$this->EventManagerPage()->updateEventCache();
	}
}
