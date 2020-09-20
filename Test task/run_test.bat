@echo OFF
set test_file="Test task.jmx"
set log_name=log\test task
set log_file="%log_name%.jtl"
set report_name=report\test task
set report_directory="report_name"
set /a i=1
set exists=false
:loop
if exist %log_file% (
    set exists=true
)
if exist %report_directory% (
    set exists=true
)
if %exists%==true (
    set log_file="%log_name% (%i%).jtl"
    set report_directory="%report_name% (%i%)"
    set /a i+=1
    set exists=false
    goto loop
    
) else (
    goto next
)
:next
..\apache-jmeter-5.3\bin\jmeter -n -Jjmeterengine.force.system.exit=true -t %test_file% -l %log_file% -e -o %report_directory%