#!/usr/bin/env ruby
require "open-uri"

open "http://data.iana.org/TLD/tlds-alpha-by-domain.txt" do |f|
  tlds = f.readlines.reject { |line| line =~ /^#/ }.map {|tld| tld.strip.downcase}.sort

  puts "All:"
  puts tlds.join(",")
  puts
  puts "2 letters:"
  puts tlds.select { |tld| tld.size == 2 }.join(",")
  puts
  puts "3 or more letters:"
  puts tlds.select { |tld| tld.size >= 3 }.join(",")
end
