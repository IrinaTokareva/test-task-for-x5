# test-task-for-x5

Скрипт для запуска теста находится в папке "Test task" и называется "run_test.bat". После прохождения теста он генерирует файл в формате .jtl в папке "Test task/log" и дашборд в папке "Test task/report".

Тест состоит из двух частей:
1. тест с профилем на 5 итераций в минуту. Он длится 5 минут;
2. тест со ступенчатым профилем на 100 потоков. Он длится 50 минут, по 5 минут на каждую из 10 ступеней.
