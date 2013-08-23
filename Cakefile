{exec, spawn} = require "child_process"
fs = require "fs"


REPORTER = "spec"  # "nyan"

C_RED = '\u001b[31m'
C_YELLOW = '\u001b[33m'
C_BLUE = '\u001b[34m'
C_BOLD = '\u001b[1m'
C_RESET = '\u001b[0m'


print_section = (title) -> console.log "#{C_BOLD}** #{title} **#{C_RESET}"

_spawn = (cmd, options) ->
    #console.log "> #{cmd} #{options.join ' '}"
    spawn cmd, options

_exec = (cmd, cmdline) ->
    options = cmdline.split ' '
    child = _spawn cmd, options

    child.stdout.on 'data', (data) -> process.stdout.write data
    child.stderr.on 'data', (data) ->
        process.stderr.write data unless data.toString('utf8').match /^[^\w]*$/

    child.on 'exit', (code) ->
        if code isnt 0
            throw "#{cmd} exited with code #{code}"



uglifyjs_and_add_header = (header, sources, target, uglifyOptions= [], thenCallback) ->

    console.log "#{C_BOLD}#{C_BLUE}Building:#{C_RESET} #{target}"
    console.log "  #{C_BOLD}#{C_BLUE}Header:#{C_RESET} #{header}"
    console.log " #{C_BOLD}#{C_BLUE}Sources:#{C_RESET} #{sources.join ','}\n"

    headerContent = fs.readFileSync header

    out = fs.createWriteStream target, flags: 'w'
    out.write headerContent

    uglify = _spawn "./node_modules/.bin/uglifyjs", sources.concat(uglifyOptions)

    uglify.stdout.on 'data', (data) -> out.write data

    uglify.stderr.on 'data', (data) ->
        process.stderr.write data unless data.toString('utf8').match /^[^\w]*$/

    uglify.on 'exit', (code) ->
        out.write "\n"
        out.end()

        if code isnt 0
            throw "uglifyjs exited with code #{code}"
        else
            thenCallback() if typeof thenCallback is 'function'



build_custom_event = (target, uglifyOptions) ->
    uglifyjs_and_add_header 'src/custom_event-header.js',
                                ['src/custom_event.js'],
                                target,
                                if typeof uglifyOptions isnt 'function' then uglifyOptions else [],
                                arguments[arguments.length-1]




task "build-prod", "build production library -> 'custom_event-min.js'", ->
    print_section "build-prod"
    build_custom_event 'custom_event-min.js'

task "build-dev", "build development library -> 'custom_event.js'", ->
    print_section "build-dev"
    build_custom_event 'custom_event.js', ['--beautify']

task "build", "build all", ->
    invoke 'build-dev'
    invoke 'build-prod'



task "test", "run all tests from test/*", ->
    print_section "test"
    build_custom_event 'custom_event.js', ['--beautify'], ->
        _exec "./node_modules/.bin/mocha", "--compilers coffee:coffee-script --reporter #{REPORTER} --colors"

task "bench", "run benchmark suite", ->
    print_section "benchmark"
    build_custom_event 'custom_event-min.js', -> _exec "node", "benchmark.js"




isUncaughtException = no

process.on "uncaughtException", (error) ->
    isUncaughtException = yes
    console.error "#{C_BOLD}#{C_RED}Aborted because of errors.#{C_RESET}\n"

process.on "exit", ->
    console.log "#{C_BOLD}#{C_YELLOW}Ready.#{C_RESET}\n" unless isUncaughtException


