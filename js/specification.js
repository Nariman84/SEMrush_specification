$(document).ready(function() {
	var $dataFormat = $('.data-format'),
		$wrapFilter = $('.wrap'),
		$filterCondition = $('.filter'),
		$btnAddCondition = $('.add-condition__title'),
		$crossClose = $('.cross-close'),

		$apply = $('.buttons_btn-apply'),
		$reset = $('.buttons_btn-reset');

	$dataFormat.on('change', changeFormat);

	// Установка формата фильтра

	function changeFormat() {
		var $operation = $(this).next('.operation');

		var $operationText = $operation.find('.operation__text'),
			$operationNum = $operation.find('.operation__number'),
			$inputValue = $(this).siblings('.input-value');

		if ($(this).val() === 'Text field') {
			$operation.val('Containing');
			$inputValue.attr('type', 'text');
			$inputValue.val('');
		} else {
			$operation.val('Equal');
			$inputValue.attr('type', 'number');
			$inputValue.val('');
		}
		showHideOperationNum($operationNum);
		showHideOperationText($operationText);
	}

	function showHideOperationText(elem) {
		elem.each(function(i, el) {
			$(this).toggleClass('invisible');
		});
	}

	function showHideOperationNum(elem) {
		elem.each(function(i, el) {
			$(this).toggleClass('invisible');
		});
	}

	// Добавление новой строки с фильтром

	$btnAddCondition.on('click', function() {
		var lengthFilterLine = $('.filter').length;
		var lengthCrossClose = $('.cross-close').length;
		if (lengthFilterLine < 10) {
			showCrossClose();
			addNewString();
		}
		if (lengthCrossClose > 1) {
			showCrossClose();
		}
	});

	function showCrossClose() {
		$('.cross-close').addClass('active-cross');
	}

	function addNewString() {
		var $clone = $filterCondition.clone(),
			$dataFormatClone = $clone.find('.data-format'),
			$operationCloneText = $clone.find('.operation__text'),
			$operationCloneNum = $clone.find('.operation__number'),
			$inputCloneVal = $clone.find('.input-value');
		checkFormatCloneOperation($operationCloneText, $operationCloneNum);
		setDefaultTypeInput($inputCloneVal);

		$wrapFilter.append($clone);
		$dataFormatClone.on('change', changeFormat);
	}

	function checkFormatCloneOperation(operText, operNum) {
		if (operText.hasClass('invisible')) {
			operText.removeClass('invisible');
			operNum.addClass('invisible');
		}
	}

	function setDefaultTypeInput(input) {
		input.val('');
		input.attr('type', 'text');
	}

	// Удаление строки с фильтром

	$wrapFilter.on('click', '.cross-close', function(e) {
		var $target = $(e.target);
		var $delThisFilter = $target.parent();
		deleteFilterLine($delThisFilter);
	});

	function deleteFilterLine(str) {
		$(str).remove();
		if ($('.cross-close').length < 2) {
			hideCrossClose();
		}
		
	}

	function hideCrossClose() {
		var $crossClose = $('.cross-close');
		$crossClose.removeClass('active-cross');
	}

	//Сброс всего компонента в первоначальное состояние при клике Clear filter

	$reset.on('click', function() {
		resetFirstFilter();
		hideCrossClose();
		$('.output').text('');

		if ($('.filter').length > 1) {
			deleteAllAddedFilter();
		}
	});

	function deleteAllAddedFilter() {
		$('.filter').slice(1).remove();
	}

	function resetFirstFilter() {
		var $operation = $('.operation'),
			$operationNum = $('.operation__number'),
			$operationText = $('.operation__text'),
			$inputValue = $('.input-value'),
			$dataFormat = $('.data-format');

		if ($dataFormat.val() === 'Number field') {
			$dataFormat.val('Text field');
			$inputValue.attr('type', 'text');
			showHideOperationNum($operationNum);
			showHideOperationText($operationText);
		}
		$inputValue.val('');
		$operation.val('Containing');
	}

	//вывод текущего состояния фильтра при клике на Apply

	$apply.on('click', function() {
		var obj = {
			text: [],
			number: []
		};
		var $outputFilter = $('.filter'),
			$output = $('.output');

		$outputFilter.each(function(i, el) {
			var $dataFormatSel = $(el).find('.data-format').val(),
				$operationSel = $(el).find('.operation').val(),
				$inputValue = $(el).find('.input-value').val();

			return outputFilterCondition($dataFormatSel, $operationSel, $inputValue, obj);
		});
		var objOutput = JSON.stringify(obj, '', 4);
		$output.html(`<pre>${objOutput}</pre>`);
	});

	function outputFilterCondition(format, opSel, value, obj) {
		if (format === "Number field" && value) {
			obj.number.push({ operation: opSel, value: +value });
		} else if (format === "Text field" && value) {
			obj.text.push({ operation: opSel, value: value });
		}
	}
});