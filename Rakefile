require "rubygems"
require "bundler/setup"
require "closure-compiler"

HEADER = /((^\s*\/\/.*\n)+)/

task :default => [:build, :docs]

desc "Use the Closure Compiler to compress custom_event.js"
task :build do
  from    = "custom_event.js"
  to      = "custom_event-min.js"

  source  = File.read from
  header  = source.match(HEADER)
  min     = Closure::Compiler.new.compress(source)
  puts "compress: #{from} -> #{to}"
  File.open(to, 'w') do |file|
    file.write header[1].squeeze(' ') + min
  end
end

# XXX obsolete
#begin
  #require 'jasmine'
  #load 'jasmine/tasks/jasmine.rake'
#rescue LoadError
  #task :jasmine do
    #abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  #end
#end

desc "run all tests"
task :mocha do
  exec "./node_modules/.bin/mocha --compilers coffee:coffee-script -R spec"
end

namespace :mocha do
  desc "run all tests using the nyan cat!"
  task :nyan do
    exec "./node_modules/.bin/mocha --compilers coffee:coffee-script -R nyan"
  end

  desc "run the custom_event.js base testsuite only"
  task :e_base do
    exec "./node_modules/.bin/mocha --compilers coffee:coffee-script test/_e_spec.coffee"
  end
end

desc "create the documentation"
task :docs do
  exec "./node_modules/.bin/docco custom_event.js"
end

