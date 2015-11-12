<?php

class EventManagerPage extends Page {

	private static $db = array(
		'EventsPerPage' => 'Int'
	);

	private static $has_many = array(
		'Events' => 'Event'
	);

	public function getCMSFields() {
		$fields = parent::getCMSFields();

		$config = GridFieldConfig_RelationEditor::create();

		$config
			->getComponentByType('GridFieldDataColumns')
			->setDisplayFields(array(
				'Title'=> 'Title',
				'Date' => 'Date'
			));

		$eventsField = new GridField('Events', 'Events', $this->Events(), $config);

		$eventsPerPageField = new NumericField('EventsPerPage', 'Events per page');

		$fields->addFieldToTab('Root.Events', $eventsPerPageField);
		$fields->addFieldToTab('Root.Events', $eventsField);

		return $fields;
	}

	public function onAfterWrite() {
		parent::onAfterWrite();

		$this->updateEventCache();
	}

	private function generateEventJSON() {
		$data = array(
			'events' => array()
		);

		foreach ($this->Events() as $event) {
			array_push($data['events'], array(
				'title' => $event->Title,
				'date' => $event->Date,
				'description' => $event->Description
			));
		};

		return json_encode($data);
	}

	public function getEventJSON() {
		$cache = SS_Cache::factory('EventManagerPage_Events');

		if (!($json = $cache->load($this->ID))) {
			$json = $this->updateEventCache();
		}

		return $json;
	}

	public function updateEventCache() {
		$cache = SS_Cache::factory('EventManagerPage_Events');

		$json = $this->generateEventJSON();

		$cache->save($json, $this->ID);

		return $json;
	}
}

class EventManagerPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		'fetch'
	);

	public function init() {
		parent::init();

		Requirements::javascript(SILVERSTRIPE_EVENT_MANAGER_DIR . '/javascript/dist/bundle.js');
	}

	public function fetch(SS_HTTPRequest $request) {
		$json = $this->getEventJSON();

		$this->response->addHeader('Content-type', 'application/json');
		$this->response->setBody($json);

		return $this->response;
	}

	public function getFetchEndpoint() {
		return $this->Link() . 'fetch';
	}
}
