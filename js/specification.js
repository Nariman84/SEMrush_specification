$(document).ready(function() {
	var $dataFormat = $('.data-format'),
		$wrapFilter = $('.wrap'),
		$filterCondition = $('.filter'),
		$btnAddCondition = $('.add-condition__title'),
		$crossClose = $('.cross-close'),

		$apply = $('.btn_apply'),
		$reset = $('.btn_reset');

	$dataFormat.on('change', {i: 0}, changeFormat);

	function changeFormat(e) {
		var target = e.target;
		var i = e.data.i;
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

	$btnAddCondition.on('click', function() {
		var lengthFilterLine = $('.filter').length;
		if (lengthFilterLine < 10) {
			showCrossClose();
			addNewString(lengthFilterLine);
		}
	});

	function addNewString(idx) {
		var $clone = $filterCondition.clone();
		$clone.children('.input-value').val('');
		$clone.children('.input-value').attr('type', 'text');
		$wrapFilter.append($clone);
		$clone.children('.data-format').on('change', {i: idx}, changeFormat);
	}

	function showCrossClose() {
		$crossClose.addClass('active-cross');
	}

	// Удаление строки

	$wrapFilter.on('click', '.cross-close', function(e) {
		var $target = $(e.target);
		var $delStr = $target.parent();
		deleteFilterLine($delStr);
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

	$reset.on('click', function() {
		deleteAddedLines();
		resetFirstLine();
		hideCrossClose();
		$('.output').text('');
	});

	function deleteAddedLines() {
		$('.filter').slice(1).remove();
	}

	function resetFirstLine() {
		$dataFormat.val('Text field');
		var $operationNum = $dataFormat.next('.operation').children('.operation__number'),
			$operationText = $dataFormat.next('.operation').children('.operation__text');
		$('.input-value').attr('type', 'text');
		$('.input-value').val('');
		$('.operation').val('Containing');
		
		showHideOperationNum($operationNum);
		showHideOperationText($operationText);
	}

	//вывод текущего состояния фильтра

	$apply.on('click', function() {
		var obj = {
			text: [],
			number: []
		};
		var $outputFilter = $('.filter');
		var $output = $('.output');
		$outputFilter.each(function(i, el) {
			var $dataFormatSel = $(el).children().eq(0).val();
			var $operationSel = $(el).children().eq(1).val();
			var $inputValue = $(el).children().eq(2).val();

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