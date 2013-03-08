{exec} = require "child_process"

REPORTER = "spec"  # "nyan"

C_RED = '\u001b[31m'
C_YELLOW = '\u001b[33m'
C_BLUE = '\u001b[34m'
C_BOLD = '\u001b[1m'
C_RESET = '\u001b[0m'

print_section = (title) -> console.log "#{C_BOLD}** #{title} **#{C_RESET}"


_exec = (cmdLine, onFinish) ->
    console.log "> #{cmdLine}"
    exec cmdLine, (error, stdout, stderr) ->
        console.log stdout unless stdout.length is 0
        if error
            console.error stderr
            throw error
        onFinish() if onFinish

uglifyjs = (sources, outFile, options...) ->
    cmdLine = "#{sources.join ' '} #{options.join ' '} -o #{outFile}"
    return "./node_modules/.bin/uglifyjs #{cmdLine}"

add_header = (headerFile, outFile, onFinish) ->
    _exec "cat #{headerFile} > #{outFile}", ->
        _exec "cat #{outFile}.tmp >> #{outFile}", ->
            _exec "rm #{outFile}.tmp", onFinish


task "build-production", "build production library -> 'custom_event-min.js'", ->
    print_section "build-production"
    _exec uglifyjs(['src/custom_event.js'], 'custom_event-min.js.tmp'), ->
        add_header 'src/custom_event-header.js', 'custom_event-min.js'

task "build-development", "build development library -> 'custom_event.js'", ->
    print_section "build-development"
    _exec uglifyjs(['src/custom_event.js'], 'custom_event.js.tmp', '--beautify'), ->
        add_header 'src/custom_event-header.js', 'custom_event.js'

task "build", "build all", ->
    invoke 'build-development'
    invoke 'build-production'

task "test", "run all tests from test/*", ->
    invoke 'build-development'
    print_section "test"
    _exec "NODE_ENV=test ./node_modules/.bin/mocha --compilers coffee:coffee-script --reporter #{REPORTER} --colors"



isUncaughtException = no

process.on "uncaughtException", (error) ->
    isUncaughtException = yes
    console.error "#{C_BOLD}#{C_RED}Aborted because of errors.#{C_RESET}\n"

process.on "exit", ->
    console.log "#{C_BOLD}#{C_YELLOW}Ready.#{C_RESET}\n" unless isUncaughtException


