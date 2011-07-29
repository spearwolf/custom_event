require "rubygems"
require "bundler/setup"
require "closure-compiler"

HEADER = /((^\s*\/\/.*\n)+)/

desc "Use the Closure Compiler to compress custom_event.js"
task :build do
  source  = File.read('custom_event.js')
  header  = source.match(HEADER)
  min     = Closure::Compiler.new.compress(source)
  File.open('custom_event-min.js', 'w') do |file|
    file.write header[1].squeeze(' ') + min
  end
end
