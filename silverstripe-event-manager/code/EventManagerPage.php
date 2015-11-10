<?php

class EventManagerPage extends Page {

	private static $has_many = array(
		'Events' => 'Event'
	);

	public function getCMSFields() {
		$fields = parent::getCMSFields();

		$config = GridFieldConfig_RelationEditor::create();

		$config
			->getComponentByType('GridFieldDataColumns')
			->setDisplayFields(array(
				'Name' => 'Name',
				'Event.Title'=> 'Event'
			));

		$eventsField = new GridField('Events', 'Events', $this->Events(), $config);

		$fields->addFieldToTab('Root.Events', $eventsField); 

		return $fields;
	}
}

class EventManagerPage_Controller extends Page_Controller {
	public function init() {
		parent::init();

		Requirements::javascript(SILVERSTRIPE_EVENT_MANAGER_DIR . '/javascript/dist/bundle.js');
	}
}
