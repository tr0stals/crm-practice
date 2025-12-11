


Компонент TooltipIcon - выполняет функцию иконки с подсказкой. При наведении на иконку сверху вылезает подсказка.

Параметры:
    tooltipText: string - текст подсказки.

Слоты:
    #icon - может передаваться всё что угодно. Лучше передавать иконки lucide или компоненты.

Пример использования:

<TooltipIcon 
    tooltip-text="Со списанием"
>
    <template #icon>
        <PackageMinus />
    </template>
</TooltipIcon>
