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

	function changeFormat(e) {
		var target = e.target;
		var $operation = $(this).next('.operation');

		var $operationText = $operation.children('.operation__text'),
			$operationNum = $operation.children('.operation__number'),
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
		if (lengthFilterLine < 10) {
			showCrossClose();
			addNewString(lengthFilterLine);
		}
	});

	function showCrossClose() {
		$crossClose.addClass('active-cross');
	}

	function addNewString(idx) {
		var $clone = $filterCondition.clone(),
			$dataFormatClone = $clone.children('.data-format'),
			$operationClone = $clone.children('.operation'),
			$operationCloneText = $operationClone.children('.operation__text'),
			$operationCloneNum = $operationClone.children('.operation__number'),
			$inputCloneVal = $clone.children('.input-value');

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
		hideCrossClose();
	}

	function hideCrossClose() {
		if ($('.cross-close').length < 2) {
			$crossClose.removeClass('active-cross');
		}
	}

	//Сброс всего компонента в первоначальное состояние при клике Clear filter

	$reset.on('click', function() {
		deleteAllAddedFilter();
		resetFirstFilter();
		hideCrossClose();
		$('.output').text('');
	});

	function deleteAllAddedFilter() {
		$('.filter').slice(1).remove();
	}

	function resetFirstFilter() {
		if ($dataFormat.val() === 'Number field') {
			$dataFormat.val('Text field');
			var $operationNum = $dataFormat.next('.operation').children('.operation__number'),
				$operationText = $dataFormat.next('.operation').children('.operation__text');
			$('.input-value').attr('type', 'text');
			$('.input-value').val('');
			$('.operation').val('Containing');

			showHideOperationNum($operationNum);
			showHideOperationText($operationText);
		}
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
			var $dataFormatSel = $(el).children().eq(0).val(),
				$operationSel = $(el).children().eq(1).val(),
				$inputValue = $(el).children().eq(2).val();

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